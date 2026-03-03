import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  User,
  Invitation,
  BabyMembership,
  Baby,
} from '../entities';
import {
  InvitationStatus,
  UserStatus,
  Role,
  MembershipStatus,
  BabyStatus,
} from '@yuna/shared-types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Invitation)
    private readonly invitationRepo: Repository<Invitation>,
    @InjectRepository(BabyMembership)
    private readonly membershipRepo: Repository<BabyMembership>,
    @InjectRepository(Baby)
    private readonly babyRepo: Repository<Baby>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /** 매직링크 발송 (개발환경에서는 console에 출력) */
  async sendMagicLink(email: string) {
    const user = await this.userRepo.findOne({ where: { email } });
    if (!user) {
      throw new BadRequestException('등록되지 않은 이메일입니다');
    }

    const token = uuidv4();
    const ttlMinutes = parseInt(
      this.configService.get('MAGIC_LINK_TTL', '30m').replace('m', ''),
    );

    // 매직링크를 Invitation 테이블에 저장 (type을 magic-link로 활용)
    // 간단하게 user에 magicLinkToken 컬럼 대신, JWT에 이메일 인코딩
    const magicToken = this.jwtService.sign(
      { email, type: 'magic-link' },
      { expiresIn: `${ttlMinutes}m` },
    );

    const appUrl = this.configService.get('APP_URL', 'http://localhost:3001');
    const link = `${appUrl}/api/auth/magic-link/verify?token=${magicToken}`;

    // 개발환경: 콘솔 출력
    console.log(`\n========== MAGIC LINK ==========`);
    console.log(`Email: ${email}`);
    console.log(`Link: ${link}`);
    console.log(`================================\n`);

    return { message: '매직링크가 발송되었습니다' };
  }

  /** 매직링크 검증 → 세션(토큰) 발급 */
  async verifyMagicLink(token: string) {
    try {
      const payload = this.jwtService.verify(token);
      if (payload.type !== 'magic-link') {
        throw new UnauthorizedException('유효하지 않은 토큰입니다');
      }

      const user = await this.userRepo.findOne({
        where: { email: payload.email },
      });
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('유효하지 않은 사용자입니다');
      }

      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException('만료되었거나 유효하지 않은 링크입니다');
    }
  }

  /** 초대 토큰으로 신규 사용자 등록 */
  async register(name: string, inviteToken: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { token: inviteToken, status: InvitationStatus.PENDING },
    });

    if (!invitation || new Date() > invitation.expiresAt) {
      throw new BadRequestException('유효하지 않거나 만료된 초대입니다');
    }

    // 이미 가입된 사용자인지 확인
    let user = await this.userRepo.findOne({
      where: { email: invitation.inviteeEmail },
    });

    if (user) {
      throw new ConflictException('이미 가입된 이메일입니다');
    }

    // 신규 User 생성
    user = this.userRepo.create({
      email: invitation.inviteeEmail,
      name,
      status: UserStatus.ACTIVE,
    });
    await this.userRepo.save(user);

    // BabyMembership 생성 (INVITED 역할)
    const membership = this.membershipRepo.create({
      babyId: invitation.babyId,
      userId: user.id,
      role: Role.INVITED,
      status: MembershipStatus.ACTIVE,
    });
    await this.membershipRepo.save(membership);

    // 초대 상태 업데이트
    invitation.status = InvitationStatus.ACCEPTED;
    await this.invitationRepo.save(invitation);

    return this.issueTokens(user);
  }

  /** 초대 토큰으로 기존 사용자 수락 */
  async acceptInvitation(userId: string, inviteToken: string) {
    const invitation = await this.invitationRepo.findOne({
      where: { token: inviteToken, status: InvitationStatus.PENDING },
    });

    if (!invitation || new Date() > invitation.expiresAt) {
      throw new BadRequestException('유효하지 않거나 만료된 초대입니다');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user || user.email !== invitation.inviteeEmail) {
      throw new BadRequestException('초대 대상이 아닙니다');
    }

    // 이미 멤버인지 확인
    const existing = await this.membershipRepo.findOne({
      where: { babyId: invitation.babyId, userId },
    });
    if (existing) {
      throw new ConflictException('이미 해당 Baby의 멤버입니다');
    }

    const membership = this.membershipRepo.create({
      babyId: invitation.babyId,
      userId,
      role: Role.INVITED,
      status: MembershipStatus.ACTIVE,
    });
    await this.membershipRepo.save(membership);

    invitation.status = InvitationStatus.ACCEPTED;
    await this.invitationRepo.save(invitation);

    return { message: '초대를 수락했습니다' };
  }

  /** refreshToken으로 accessToken 갱신 */
  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_SECRET', 'dev-jwt-secret'),
      });

      const user = await this.userRepo.findOne({
        where: { id: payload.sub },
      });
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException();
      }

      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다');
    }
  }

  /** 현재 사용자 정보 반환 */
  async getMe(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['memberships', 'memberships.baby'],
    });

    if (!user) throw new UnauthorizedException();

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      babies: user.memberships
        .filter((m) => m.status === MembershipStatus.ACTIVE)
        .map((m) => ({
          id: m.baby.id,
          name: m.baby.name,
          role: m.role,
        })),
    };
  }

  /** 개발 환경 전용: 테스트 유저 자동 생성 + 로그인 */
  async devLogin() {
    const devEmail = 'dev@yuna.app';

    let user = await this.userRepo.findOne({ where: { email: devEmail } });
    if (!user) {
      user = this.userRepo.create({
        email: devEmail,
        name: '개발자',
        status: UserStatus.ACTIVE,
      });
      await this.userRepo.save(user);
    }

    // Baby가 없으면 하나 생성
    let membership = await this.membershipRepo.findOne({
      where: { userId: user.id },
    });

    if (!membership) {
      const baby = this.babyRepo.create({
        name: '우리 아기',
        gender: null,
        birthDate: '2025-01-01',
        status: BabyStatus.ACTIVE,
      });
      await this.babyRepo.save(baby);

      membership = this.membershipRepo.create({
        babyId: baby.id,
        userId: user.id,
        role: Role.OWNER,
        status: MembershipStatus.ACTIVE,
      });
      await this.membershipRepo.save(membership);
    }

    return this.issueTokens(user);
  }

  /** Access + Refresh 토큰 발급 */
  private issueTokens(user: User) {
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { expiresIn: this.configService.get('JWT_ACCESS_TTL', '15m') },
    );

    const refreshToken = this.jwtService.sign(
      { sub: user.id, type: 'refresh' },
      { expiresIn: this.configService.get('JWT_REFRESH_TTL', '30d') },
    );

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }
}
