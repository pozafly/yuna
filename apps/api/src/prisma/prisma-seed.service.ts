import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  BabyStatus,
  InvitationStatus,
  MembershipStatus,
  NotificationType,
  Role,
  UserStatus,
  Visibility
} from '@prisma/client';
import { createId } from '../common/utils/id.util';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaSeedService implements OnModuleInit {
  private readonly logger = new Logger(PrismaSeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    const autoSeed = process.env.PRISMA_AUTO_SEED !== 'false';
    if (!autoSeed) {
      return;
    }

    const ownerId = 'user_owner';
    const invitedId = 'user_invited';
    const babyId = 'baby_seed';
    const welcomePostId = 'post_seed_welcome';

    await this.prisma.user.upsert({
      where: { id: ownerId },
      update: { email: 'owner@yuna.local', name: 'Yuna Owner', status: UserStatus.ACTIVE },
      create: {
        id: ownerId,
        email: 'owner@yuna.local',
        name: 'Yuna Owner',
        status: UserStatus.ACTIVE
      }
    });

    await this.prisma.user.upsert({
      where: { id: invitedId },
      update: {
        email: 'invited@yuna.local',
        name: 'Yuna Family',
        status: UserStatus.ACTIVE
      },
      create: {
        id: invitedId,
        email: 'invited@yuna.local',
        name: 'Yuna Family',
        status: UserStatus.ACTIVE
      }
    });

    await this.prisma.baby.upsert({
      where: { id: babyId },
      update: {
        name: 'Yuna',
        gender: 'FEMALE',
        birthDate: null,
        status: BabyStatus.ACTIVE
      },
      create: {
        id: babyId,
        name: 'Yuna',
        gender: 'FEMALE',
        birthDate: null,
        status: BabyStatus.ACTIVE
      }
    });

    await this.prisma.babyMembership.upsert({
      where: { babyId_userId: { babyId, userId: ownerId } },
      update: {
        role: Role.OWNER,
        status: MembershipStatus.ACTIVE,
        joinedAt: new Date(),
        invitedAt: new Date()
      },
      create: {
        id: createId('memb'),
        babyId,
        userId: ownerId,
        role: Role.OWNER,
        status: MembershipStatus.ACTIVE,
        invitedAt: new Date(),
        joinedAt: new Date()
      }
    });

    await this.prisma.babyMembership.upsert({
      where: { babyId_userId: { babyId, userId: invitedId } },
      update: {
        role: Role.INVITED,
        status: MembershipStatus.ACTIVE,
        joinedAt: new Date(),
        invitedAt: new Date()
      },
      create: {
        id: createId('memb'),
        babyId,
        userId: invitedId,
        role: Role.INVITED,
        status: MembershipStatus.ACTIVE,
        invitedAt: new Date(),
        joinedAt: new Date()
      }
    });

    await this.prisma.post.upsert({
      where: { id: welcomePostId },
      update: {
        content: 'Yuna에 오신 걸 환영해요.',
        visibility: Visibility.INVITED,
        updatedAt: new Date()
      },
      create: {
        id: welcomePostId,
        babyId,
        authorId: ownerId,
        content: 'Yuna에 오신 걸 환영해요.',
        visibility: Visibility.INVITED,
        mediaUrls: [],
        updatedAt: new Date()
      }
    });

    const existingNotification = await this.prisma.notification.findFirst({
      where: {
        recipientId: invitedId,
        type: NotificationType.NEW_POST,
        targetId: welcomePostId
      }
    });

    if (!existingNotification) {
      await this.prisma.notification.create({
        data: {
          id: createId('noti'),
          recipientId: invitedId,
          type: NotificationType.NEW_POST,
          targetType: 'POST',
          targetId: welcomePostId,
          isRead: false
        }
      });
    }

    const pendingInvitations = await this.prisma.invitation.findMany({
      where: { status: InvitationStatus.PENDING, expiresAt: { lt: new Date() } }
    });

    if (pendingInvitations.length > 0) {
      await this.prisma.invitation.updateMany({
        where: { status: InvitationStatus.PENDING, expiresAt: { lt: new Date() } },
        data: { status: InvitationStatus.EXPIRED }
      });
    }

    this.logger.log('Prisma seed applied');
  }
}
