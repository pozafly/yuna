/**
 * Baby 서비스 — Baby 생성/조회/삭제 + BabyMembership 관리
 */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Baby, BabyMembership, User } from '../common/entities';

@Injectable()
export class BabyService {
    constructor(
        @InjectRepository(Baby)
        private readonly babyRepo: Repository<Baby>,
        @InjectRepository(BabyMembership)
        private readonly membershipRepo: Repository<BabyMembership>,
    ) { }

    /** Baby 생성 + OWNER membership 자동 등록 */
    async create(userId: string, data: { name: string; gender: string; birthDate?: string }): Promise<Baby> {
        const baby = this.babyRepo.create({
            name: data.name,
            gender: data.gender,
            birthDate: data.birthDate ? new Date(data.birthDate) : null,
        });
        const saved = await this.babyRepo.save(baby);

        // OWNER membership 자동 생성
        const membership = this.membershipRepo.create({
            babyId: saved.id,
            userId,
            role: 'OWNER',
            status: 'ACTIVE',
            joinedAt: new Date(),
        });
        await this.membershipRepo.save(membership);

        return saved;
    }

    /** 사용자가 접근 가능한 Baby 목록 조회 */
    async findAllByUser(userId: string): Promise<Baby[]> {
        const memberships = await this.membershipRepo.find({
            where: { userId, status: 'ACTIVE' },
            relations: ['baby'],
        });
        return memberships
            .map((m) => m.baby)
            .filter((b) => b.status === 'ACTIVE');
    }

    /** Baby 상세 조회 (권한 확인 포함) */
    async findOneWithAuth(babyId: string, userId: string): Promise<{ baby: Baby; membership: BabyMembership }> {
        const baby = await this.babyRepo.findOne({ where: { id: babyId } });
        if (!baby || baby.status !== 'ACTIVE') {
            throw new NotFoundException('Baby를 찾을 수 없습니다.');
        }

        const membership = await this.membershipRepo.findOne({
            where: { babyId, userId, status: 'ACTIVE' },
        });
        if (!membership) {
            throw new ForbiddenException('이 Baby에 접근 권한이 없습니다.');
        }

        return { baby, membership };
    }

    /** Baby 수정 (OWNER만) */
    async update(babyId: string, userId: string, data: Partial<Baby>): Promise<Baby> {
        const { baby, membership } = await this.findOneWithAuth(babyId, userId);
        if (membership.role !== 'OWNER') {
            throw new ForbiddenException('OWNER만 Baby 정보를 수정할 수 있습니다.');
        }

        Object.assign(baby, data);
        return this.babyRepo.save(baby);
    }

    /** Baby 삭제 — soft delete (OWNER만, 30일 다운로드 정책) */
    async remove(babyId: string, userId: string): Promise<void> {
        const { baby, membership } = await this.findOneWithAuth(babyId, userId);
        if (membership.role !== 'OWNER') {
            throw new ForbiddenException('OWNER만 Baby를 삭제할 수 있습니다.');
        }

        baby.status = 'DELETED';
        baby.deletedAt = new Date();
        // 삭제 후 30일간 다운로드 가능
        baby.downloadExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        await this.babyRepo.save(baby);
    }

    /** 사용자의 Baby 구성원 역할 확인 */
    async getMembership(babyId: string, userId: string): Promise<BabyMembership | null> {
        return this.membershipRepo.findOne({
            where: { babyId, userId, status: 'ACTIVE' },
        });
    }
}
