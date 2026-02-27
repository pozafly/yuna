/**
 * Invitation 서비스 — 초대 발송, 수락, 취소, 차단
 * PRD-A/B: 이메일 기반 초대, 토큰 30분 만료, Baby 단위 관리
 */
import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Invitation, BabyMembership, User } from '../common/entities';

@Injectable()
export class InvitationService {
    constructor(
        @InjectRepository(Invitation)
        private readonly invitationRepo: Repository<Invitation>,
        @InjectRepository(BabyMembership)
        private readonly membershipRepo: Repository<BabyMembership>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    /** 초대 발송 — OWNER만 가능, 30분 만료 토큰 생성 */
    async create(inviterId: string, data: { babyId: string; inviteeEmail: string; role: string }): Promise<Invitation> {
        // OWNER 권한 확인
        const membership = await this.membershipRepo.findOne({
            where: { babyId: data.babyId, userId: inviterId, role: 'OWNER', status: 'ACTIVE' },
        });
        if (!membership) throw new ForbiddenException('OWNER만 초대를 발송할 수 있습니다.');

        const token = uuid();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30분

        const invitation = this.invitationRepo.create({
            babyId: data.babyId,
            inviterId,
            inviteeEmail: data.inviteeEmail,
            role: data.role || 'INVITED',
            token,
            expiresAt,
            status: 'PENDING',
        });

        const saved = await this.invitationRepo.save(invitation);
        // TODO: 이메일 발송
        console.log(`📧 초대 발송: ${data.inviteeEmail} → /auth/invite/verify?token=${token}`);
        return saved;
    }

    /** 초대 수락 — 토큰 검증 → BabyMembership 생성 */
    async accept(token: string, userId: string): Promise<BabyMembership> {
        const invitation = await this.invitationRepo.findOne({ where: { token } });
        if (!invitation) throw new NotFoundException('초대를 찾을 수 없습니다.');
        if (invitation.status !== 'PENDING') throw new BadRequestException('이미 처리된 초대입니다.');
        if (new Date() > invitation.expiresAt) {
            invitation.status = 'EXPIRED';
            await this.invitationRepo.save(invitation);
            throw new BadRequestException('초대가 만료되었습니다.');
        }

        // BabyMembership 생성
        const membership = this.membershipRepo.create({
            babyId: invitation.babyId,
            userId,
            role: invitation.role,
            status: 'ACTIVE',
            invitedAt: invitation.createdAt,
            joinedAt: new Date(),
        });
        await this.membershipRepo.save(membership);

        // 초대 상태 업데이트
        invitation.status = 'ACCEPTED';
        await this.invitationRepo.save(invitation);

        return membership;
    }

    /** 초대 취소 (OWNER) */
    async cancel(invitationId: string, userId: string): Promise<void> {
        const invitation = await this.invitationRepo.findOne({ where: { id: invitationId } });
        if (!invitation) throw new NotFoundException('초대를 찾을 수 없습니다.');

        const membership = await this.membershipRepo.findOne({
            where: { babyId: invitation.babyId, userId, role: 'OWNER', status: 'ACTIVE' },
        });
        if (!membership) throw new ForbiddenException('OWNER만 초대를 취소할 수 있습니다.');

        invitation.status = 'CANCELLED';
        await this.invitationRepo.save(invitation);
    }

    /** Baby의 초대 목록 조회 (OWNER) */
    async findAllByBaby(babyId: string): Promise<Invitation[]> {
        return this.invitationRepo.find({ where: { babyId }, order: { createdAt: 'DESC' } });
    }
}
