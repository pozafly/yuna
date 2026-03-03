import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepo: Repository<Notification>,
  ) {}

  async findByUser(userId: string, page = 1, limit = 20) {
    const [notifications, totalCount] = await this.notificationRepo.findAndCount({
      where: { recipientId: userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: notifications.map((n) => ({
        id: n.id,
        recipientId: n.recipientId,
        type: n.type,
        targetType: n.targetType,
        targetId: n.targetId,
        isRead: n.isRead,
        message: '',
        createdAt: n.createdAt.toISOString(),
      })),
      pagination: { page, limit, totalCount, totalPages: Math.ceil(totalCount / limit) },
    };
  }

  async markAsRead(notificationId: string, userId: string) {
    await this.notificationRepo.update(
      { id: notificationId, recipientId: userId },
      { isRead: true },
    );
    return { message: '읽음 처리되었습니다' };
  }

  async markAllAsRead(userId: string) {
    await this.notificationRepo.update(
      { recipientId: userId, isRead: false },
      { isRead: true },
    );
    return { message: '전체 읽음 처리되었습니다' };
  }
}
