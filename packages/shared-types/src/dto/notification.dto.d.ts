import { NotificationType } from '../enums';
export interface NotificationResponseDto {
    id: string;
    recipientId: string;
    type: NotificationType;
    targetType: string;
    targetId: string;
    isRead: boolean;
    message: string;
    createdAt: string;
}
//# sourceMappingURL=notification.dto.d.ts.map