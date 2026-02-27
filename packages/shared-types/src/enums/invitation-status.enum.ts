/**
 * 초대 상태
 * - PENDING: 초대 발송됨, 아직 수락 전
 * - ACCEPTED: 수락 완료
 * - EXPIRED: 토큰 만료 (30분 초과)
 * - CANCELLED: OWNER가 초대 취소
 */
export enum InvitationStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
}
