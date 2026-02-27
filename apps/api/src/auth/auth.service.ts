import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import {
  InvitationStatus,
  MembershipStatus,
  Role,
  UserStatus
} from '@prisma/client';
import {
  LoginResponseDto,
  MagicLinkRequestDto
} from '@yuna/shared-types';
import { createId, plusDays, plusMinutes } from '../common/utils/id.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async requestMagicLink(dto: MagicLinkRequestDto) {
    const email = dto.email.trim().toLowerCase();
    if (!email) {
      throw new BadRequestException('이메일은 필수입니다.');
    }

    const token = createId('magic');

    await this.prisma.magicLinkToken.create({
      data: {
        token,
        email,
        expiresAt: plusMinutes(30),
        consumed: false
      }
    });

    return {
      success: true,
      data: { sent: true, token },
      message: '개발 모드에서는 응답에 토큰이 포함됩니다.'
    };
  }

  async verifyMagicLink(token: string) {
    const magic = await this.prisma.magicLinkToken.findUnique({
      where: { token }
    });

    if (!magic) {
      throw new UnauthorizedException('유효하지 않은 매직링크입니다.');
    }

    if (magic.consumed) {
      throw new UnauthorizedException('이미 사용된 매직링크입니다.');
    }

    if (magic.expiresAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('만료된 매직링크입니다.');
    }

    await this.prisma.magicLinkToken.update({
      where: { token },
      data: { consumed: true }
    });

    const user = await this.findOrCreateUserByEmail(magic.email);
    const session = await this.createSession(user.id);

    return {
      user: { userId: user.id, email: user.email, name: user.name },
      accessToken: session.accessToken,
      refreshToken: session.refreshToken
    };
  }

  async verifyInvitation(token: string) {
    const invitation = await this.prisma.invitation.findUnique({ where: { token } });

    if (!invitation) {
      throw new UnauthorizedException('유효하지 않은 초대 링크입니다.');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new UnauthorizedException('이미 처리된 초대 링크입니다.');
    }

    if (invitation.expiresAt.getTime() <= Date.now()) {
      await this.prisma.invitation.update({
        where: { id: invitation.id },
        data: { status: InvitationStatus.EXPIRED }
      });
      throw new UnauthorizedException('만료된 초대 링크입니다.');
    }

    const user = await this.findOrCreateUserByEmail(invitation.inviteeEmail);

    await this.prisma.babyMembership.upsert({
      where: {
        babyId_userId: {
          babyId: invitation.babyId,
          userId: user.id
        }
      },
      update: {
        role: invitation.role,
        status: MembershipStatus.ACTIVE,
        joinedAt: new Date(),
        blockedAt: null,
        withdrawnAt: null
      },
      create: {
        id: createId('memb'),
        babyId: invitation.babyId,
        userId: user.id,
        role: invitation.role,
        status: MembershipStatus.ACTIVE,
        invitedAt: invitation.createdAt,
        joinedAt: new Date()
      }
    });

    await this.prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: InvitationStatus.ACCEPTED }
    });

    const session = await this.createSession(user.id);

    return {
      user: { userId: user.id, email: user.email, name: user.name },
      accessToken: session.accessToken,
      refreshToken: session.refreshToken
    };
  }

  async socialLogin(email: string): Promise<{
    user: LoginResponseDto;
    accessToken: string;
    refreshToken: string;
  }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await this.findOrCreateUserByEmail(normalizedEmail);
    const session = await this.createSession(user.id);

    return {
      user: { userId: user.id, email: user.email, name: user.name },
      accessToken: session.accessToken,
      refreshToken: session.refreshToken
    };
  }

  async refreshSession(refreshToken?: string) {
    if (!refreshToken) {
      throw new BadRequestException('refresh token 이 필요합니다.');
    }

    const session = await this.prisma.session.findFirst({
      where: {
        refreshToken,
        refreshExpiresAt: {
          gt: new Date()
        }
      }
    });

    if (!session) {
      throw new UnauthorizedException('유효하지 않은 refresh token 입니다.');
    }

    const updated = await this.prisma.session.update({
      where: { accessToken: session.accessToken },
      data: {
        accessToken: createId('at'),
        accessExpiresAt: plusMinutes(15)
      }
    });

    return {
      accessToken: updated.accessToken,
      refreshToken: updated.refreshToken
    };
  }

  async logout(accessToken?: string, refreshToken?: string) {
    if (!accessToken && !refreshToken) {
      return { success: true };
    }

    const conditions: Array<{ accessToken?: string; refreshToken?: string }> = [];
    if (accessToken) {
      conditions.push({ accessToken });
    }
    if (refreshToken) {
      conditions.push({ refreshToken });
    }

    await this.prisma.session.deleteMany({
      where: {
        OR: conditions
      }
    });

    return { success: true };
  }

  private async findOrCreateUserByEmail(email: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      return existing;
    }

    return this.prisma.user.create({
      data: {
        id: createId('user'),
        email,
        name: email.split('@')[0] ?? 'Yuna User',
        status: UserStatus.ACTIVE
      }
    });
  }

  private async createSession(userId: string) {
    return this.prisma.session.create({
      data: {
        accessToken: createId('at'),
        refreshToken: createId('rt'),
        userId,
        accessExpiresAt: plusMinutes(15),
        refreshExpiresAt: plusDays(30)
      }
    });
  }

  async getDevOwnerToken() {
    const owner = await this.prisma.user.findUnique({ where: { id: 'user_owner' } });
    if (!owner) {
      throw new BadRequestException('개발용 OWNER 계정이 없습니다.');
    }

    const session = await this.createSession(owner.id);
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      userId: owner.id
    };
  }

  async getDevInvitedToken() {
    const invited = await this.prisma.user.findUnique({ where: { id: 'user_invited' } });
    if (!invited) {
      throw new BadRequestException('개발용 INVITED 계정이 없습니다.');
    }

    const session = await this.createSession(invited.id);
    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      userId: invited.id
    };
  }
}
