import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {
  BabyStatus,
  MembershipStatus,
  Role,
  Visibility
} from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthorizationService {
  constructor(private readonly prisma: PrismaService) {}

  async getActiveMembership(userId: string, babyId: string) {
    return this.prisma.babyMembership.findFirst({
      where: {
        userId,
        babyId,
        status: MembershipStatus.ACTIVE
      }
    });
  }

  async assertBabyActive(babyId: string) {
    const baby = await this.prisma.baby.findUnique({ where: { id: babyId } });

    if (!baby) {
      throw new NotFoundException('Baby를 찾을 수 없습니다.');
    }

    if (baby.status !== BabyStatus.ACTIVE) {
      throw new ForbiddenException('삭제된 Baby에는 접근할 수 없습니다.');
    }

    return baby;
  }

  async assertCanAccessBaby(userId: string, babyId: string) {
    // Baby 자체 상태(DELETED 여부)와 멤버십 상태를 모두 만족해야만 접근 가능합니다.
    // 프론트에서 숨겼더라도 서버에서 최종 거부하도록 강제합니다.
    await this.assertBabyActive(babyId);

    const membership = await this.getActiveMembership(userId, babyId);
    if (!membership) {
      throw new ForbiddenException('해당 Baby에 대한 접근 권한이 없습니다.');
    }

    return membership;
  }

  async assertOwner(userId: string, babyId: string) {
    const membership = await this.assertCanAccessBaby(userId, babyId);

    if (membership.role !== Role.OWNER) {
      throw new ForbiddenException('OWNER만 수행 가능한 작업입니다.');
    }

    return membership;
  }

  async assertCanReadByVisibility(
    userId: string,
    babyId: string,
    visibility: Visibility
  ) {
    const membership = await this.assertCanAccessBaby(userId, babyId);

    // PRIVATE는 OWNER 전용이라는 PRD 규칙을 서버에서 고정으로 보장합니다.
    if (visibility === Visibility.PRIVATE && membership.role !== Role.OWNER) {
      throw new ForbiddenException('PRIVATE 콘텐츠는 OWNER만 열람할 수 있습니다.');
    }

    return membership;
  }
}
