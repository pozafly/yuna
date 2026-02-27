import { Role, InvitationStatus } from '../enums';

/** FE → BE: 초대 발송 요청 */
export interface CreateInvitationDto {
    babyId: string;
    inviteeEmail: string;
    role: Role; // 초대할 역할 (OWNER 또는 INVITED)
}

/** BE → FE: 초대 응답 */
export interface InvitationResponseDto {
    id: string;
    babyId: string;
    inviterId: string;
    inviteeEmail: string;
    status: InvitationStatus;
    expiresAt: string;
    createdAt: string;
}
