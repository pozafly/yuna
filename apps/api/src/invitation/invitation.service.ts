import {
  Injectable,
  ForbiddenException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Invitation, BabyMembership } from '../entities';
import {
  Role,
  MembershipStatus,
  InvitationStatus,
} from '@yuna/shared-types';

@Injectable()
export class InvitationService {
  constructor(
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(BabyMembership)
    private readonly membershipRepo: Repository<BabyMembership>,
    private readonly configService: ConfigService,
  ) {}

  /** 초대 생성 (OWNER만) */
  async create(userId: string, babyId: string, inviteeEmail: string) {
    // OWNER 권한 확인
    const membership = await this.membershipRepo.findOne({
      where: {
        babyId,
        userId,
        role: Role.OWNER,
        status: MembershipStatus.ACTIVE,
      },
    });
    if (!membership) {
      throw new ForbiddenException('OWNER만 초대할 수 있습니다');
    }

    // 이미 PENDING 초대가 있는지 확인
    const existing = await this.invitationRepo.findOne({
      where: {
        babyId,
        inviteeEmail,
        status: InvitationStatus.PENDING,
      },
    });
    if (existing) {
      throw new BadRequestException('이미 대기 중인 초대가 있습니다');
    }

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30분

    const invitation = this.invitationRepo.create({
      babyId,
      inviterId: userId,
      inviteeEmail,
      token,
      expiresAt,
      status: InvitationStatus.PENDING,
    });
    await this.invitationRepo.save(invitation);

    // 개발환경: 초대 링크 콘솔 출력
    const appUrl = this.configService.get('APP_URL', 'http://localhost:3001');
    console.log(`\n========== INVITATION ==========`);
    console.log(`To: ${inviteeEmail}`);
    console.log(`Link: ${appUrl}/invite/${token}`);
    console.log(`================================\n`);

    return this.toResponse(invitation);
  }

  /** 특정 Baby의 초대 목록 */
  async findByBaby(babyId: string) {
    const invitations = await this.invitationRepo.find({
      where: { babyId },
      order: { createdAt: 'DESC' },
    });
    return invitations.map((i) => this.toResponse(i));
  }

  /** 초대 취소 */
  async cancel(invitationId: string, userId: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { id: invitationId },
    });
    if (!invitation) throw new NotFoundException();

    // 발송자만 취소 가능
    if (invitation.inviterId !== userId) {
      throw new ForbiddenException('초대 발송자만 취소할 수 있습니다');
    }

    invitation.status = InvitationStatus.CANCELLED;
    await this.invitationRepo.save(invitation);
    return { message: '초대가 취소되었습니다' };
  }

  /** 토큰으로 초대 조회 */
  async findByToken(token: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { token },
      relations: ['baby'],
    });
    if (!invitation) throw new NotFoundException('초대를 찾을 수 없습니다');
    return invitation;
  }

  private toResponse(inv: Invitation) {
    return {
      id: inv.id,
      babyId: inv.babyId,
      inviterId: inv.inviterId,
      inviteeEmail: inv.inviteeEmail,
      status: inv.status,
      expiresAt: inv.expiresAt.toISOString(),
      createdAt: inv.createdAt.toISOString(),
    };
  }
}
