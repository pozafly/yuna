/**
 * Baby 구성원(Membership) 상태
 * - ACTIVE: 활성 상태
 * - BLOCKED: OWNER에 의해 차단됨
 * - WITHDRAWN: 자발적 탈퇴
 */
export enum MembershipStatus {
    ACTIVE = 'ACTIVE',
    BLOCKED = 'BLOCKED',
    WITHDRAWN = 'WITHDRAWN',
}
