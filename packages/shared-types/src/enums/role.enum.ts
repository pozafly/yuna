/**
 * 사용자 역할
 * - OWNER: Baby를 생성·관리하는 사람 (공동 OWNER 가능)
 * - INVITED: OWNER로부터 이메일 초대를 받고 승인한 가족 구성원
 */
export enum Role {
    OWNER = 'OWNER',
    INVITED = 'INVITED',
}
