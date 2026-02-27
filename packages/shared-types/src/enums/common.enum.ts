/**
 * 알림 타입
 * - NEW_POST: 새 게시물 등록
 * - NEW_COMMENT: 새 댓글 등록
 * - NEW_LETTER: 새 편지 등록
 * - INVITATION: 초대 알림
 */
export enum NotificationType {
    NEW_POST = 'NEW_POST',
    NEW_COMMENT = 'NEW_COMMENT',
    NEW_LETTER = 'NEW_LETTER',
    INVITATION = 'INVITATION',
}

/**
 * 알림 대상 개체 유형
 */
export enum NotificationTargetType {
    POST = 'POST',
    LETTER = 'LETTER',
    COMMENT = 'COMMENT',
    INVITATION = 'INVITATION',
}

/**
 * 댓글 대상 유형
 */
export enum CommentTargetType {
    POST = 'POST',
    LETTER = 'LETTER',
}

/**
 * 사용자 상태
 */
export enum UserStatus {
    ACTIVE = 'ACTIVE',
    WITHDRAWN = 'WITHDRAWN',
}
