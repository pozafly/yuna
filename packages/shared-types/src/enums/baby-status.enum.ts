/**
 * Baby 상태
 * - ACTIVE: 정상 사용 중
 * - DELETED: OWNER에 의해 삭제됨 (30일간 데이터 다운로드 가능 후 완전 삭제)
 */
export enum BabyStatus {
    ACTIVE = 'ACTIVE',
    DELETED = 'DELETED',
}
