import { Injectable } from '@nestjs/common';
import {
  NotificationResponseDto,
  PaginatedResponse
} from '@yuna/shared-types';
import { toSharedNotificationType } from '../common/utils/enum.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async listForUser(
    userId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<NotificationResponseDto>> {
    const normalizedPage = page > 0 ? page : 1;
    const normalizedLimit = limit > 0 ? limit : 20;

    const [totalCount, notifications] = await this.prisma.$transaction([
      this.prisma.notification.count({ where: { recipientId: userId } }),
      this.prisma.notification.findMany({
        where: { recipientId: userId },
        orderBy: { createdAt: 'desc' },
        skip: (normalizedPage - 1) * normalizedLimit,
        take: normalizedLimit
      })
    ]);

    const data = notifications.map((item) => ({
      id: item.id,
      recipientId: item.recipientId,
      type: toSharedNotificationType(item.type),
      targetType: item.targetType,
      targetId: item.targetId,
      isRead: item.isRead,
      createdAt: item.createdAt.toISOString()
    }));

    return {
      success: true,
      data,
      pagination: {
        page: normalizedPage,
        limit: normalizedLimit,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / normalizedLimit))
      }
    };
  }
}
