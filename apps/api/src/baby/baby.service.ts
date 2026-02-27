import { Injectable } from '@nestjs/common';
import {
  BabyResponseDto,
  BabyStatus,
  CreateBabyDto,
  MembershipStatus,
  Role
} from '@yuna/shared-types';
import { AuthorizationService } from '../common/authz/authorization.service';
import {
  toPrismaBabyStatus,
  toPrismaMembershipStatus,
  toPrismaRole,
  toSharedBabyStatus,
  toSharedRole
} from '../common/utils/enum.util';
import { createId } from '../common/utils/id.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BabyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authz: AuthorizationService
  ) {}

  async create(userId: string, dto: CreateBabyDto): Promise<BabyResponseDto> {
    const now = new Date();

    const baby = await this.prisma.baby.create({
      data: {
        id: createId('baby'),
        name: dto.name,
        gender: dto.gender,
        birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
        status: toPrismaBabyStatus(BabyStatus.ACTIVE),
        createdAt: now
      }
    });

    await this.prisma.babyMembership.create({
      data: {
        id: createId('memb'),
        babyId: baby.id,
        userId,
        role: toPrismaRole(Role.OWNER),
        status: toPrismaMembershipStatus(MembershipStatus.ACTIVE),
        invitedAt: now,
        joinedAt: now
      }
    });

    return {
      id: baby.id,
      name: baby.name,
      gender: baby.gender as 'MALE' | 'FEMALE' | 'OTHER',
      birthDate: baby.birthDate ? baby.birthDate.toISOString() : null,
      status: toSharedBabyStatus(baby.status),
      createdAt: baby.createdAt.toISOString(),
      role: Role.OWNER
    };
  }

  async listForUser(userId: string): Promise<BabyResponseDto[]> {
    const memberships = await this.prisma.babyMembership.findMany({
      where: {
        userId,
        status: toPrismaMembershipStatus(MembershipStatus.ACTIVE),
        baby: {
          status: BabyStatus.ACTIVE
        }
      },
      include: {
        baby: true
      }
    });

    return memberships.map((membership) => ({
      id: membership.baby.id,
      name: membership.baby.name,
      gender: membership.baby.gender as 'MALE' | 'FEMALE' | 'OTHER',
      birthDate: membership.baby.birthDate
        ? membership.baby.birthDate.toISOString()
        : null,
      status: toSharedBabyStatus(membership.baby.status),
      createdAt: membership.baby.createdAt.toISOString(),
      role: toSharedRole(membership.role)
    }));
  }

  async remove(userId: string, babyId: string) {
    await this.authz.assertOwner(userId, babyId);

    const existing = await this.prisma.baby.findUnique({ where: { id: babyId } });
    if (!existing) {
      return { deleted: false };
    }

    const deletedAt = new Date();
    const downloadExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await this.prisma.baby.update({
      where: { id: babyId },
      data: {
        status: toPrismaBabyStatus(BabyStatus.DELETED),
        deletedAt,
        downloadExpiresAt
      }
    });

    return {
      deleted: true,
      babyId,
      downloadExpiresAt: downloadExpiresAt.toISOString()
    };
  }
}
