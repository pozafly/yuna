import { Injectable } from '@nestjs/common';
import { InvitationStatus } from '@prisma/client';
import {
  CreateInvitationDto,
  InvitationResponseDto,
  NotificationType
} from '@yuna/shared-types';
import { AuthorizationService } from '../common/authz/authorization.service';
import {
  toPrismaNotificationType,
  toPrismaRole,
  toSharedInvitationStatus,
  toSharedRole
} from '../common/utils/enum.util';
import { createId, plusMinutes } from '../common/utils/id.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvitationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authz: AuthorizationService
  ) {}

  async create(userId: string, dto: CreateInvitationDto): Promise<InvitationResponseDto> {
    await this.authz.assertOwner(userId, dto.babyId);

    const now = new Date();
    const invitation = await this.prisma.invitation.create({
      data: {
        id: createId('inv'),
        babyId: dto.babyId,
        inviterId: userId,
        inviteeEmail: dto.inviteeEmail,
        role: toPrismaRole(dto.role),
        token: createId('invtoken'),
        expiresAt: plusMinutes(30),
        status: InvitationStatus.PENDING,
        createdAt: now
      }
    });

    const invitedUser = await this.prisma.user.findUnique({
      where: { email: dto.inviteeEmail }
    });

    if (invitedUser) {
      await this.prisma.notification.create({
        data: {
          id: createId('noti'),
          recipientId: invitedUser.id,
          type: toPrismaNotificationType(NotificationType.INVITATION),
          targetType: 'INVITATION',
          targetId: invitation.id,
          isRead: false,
          createdAt: now
        }
      });
    }

    return {
      id: invitation.id,
      babyId: invitation.babyId,
      inviterId: invitation.inviterId,
      inviteeEmail: invitation.inviteeEmail,
      role: toSharedRole(invitation.role),
      token: invitation.token,
      expiresAt: invitation.expiresAt.toISOString(),
      status: toSharedInvitationStatus(invitation.status),
      createdAt: invitation.createdAt.toISOString()
    };
  }
}
