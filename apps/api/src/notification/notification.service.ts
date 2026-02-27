import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../common/entities';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepo: Repository<Notification>,
    ) { }

    /** 알림 생성 (시스템 내부 호출용) */
    async create(data: { recipientId: string; type: string; targetType: string; targetId: string }): Promise<Notification> {
        const notification = this.notificationRepo.create(data);
        return this.notificationRepo.save(notification);
    }

    /** 내 알림 목록 조회 */
    async findAllByUser(userId: string, page: number = 1, limit: number = 20) {
        const [notifications, total] = await this.notificationRepo.findAndCount({
            where: { recipientId: userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { notifications, total };
    }

    /** 알림 읽음 처리 */
    async markAsRead(id: string, userId: string): Promise<void> {
        const notification = await this.notificationRepo.findOne({ where: { id, recipientId: userId } });
        if (!notification) throw new NotFoundException('알림을 찾을 수 없습니다.');

        notification.isRead = true;
        await this.notificationRepo.save(notification);
    }

    /** 모든 알림 읽음 처리 */
    async markAllAsRead(userId: string): Promise<void> {
        await this.notificationRepo.update({ recipientId: userId, isRead: false }, { isRead: true });
    }
}
