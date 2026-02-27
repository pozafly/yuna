import { NotificationType, NotificationTargetType } from '../enums';

/** BE → FE: 알림 응답 */
export interface NotificationResponseDto {
    id: string;
    type: NotificationType;
    targetType: NotificationTargetType;
    targetId: string;
    isRead: boolean;
    createdAt: string;
}
