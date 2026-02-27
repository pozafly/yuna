import { InvitationStatus, Role } from '../enums';

export interface CreateInvitationDto {
  babyId: string;
  inviteeEmail: string;
  role: Role;
}

export interface InvitationResponseDto {
  id: string;
  babyId: string;
  inviterId: string;
  inviteeEmail: string;
  role: Role;
  token: string;
  expiresAt: string;
  status: InvitationStatus;
  createdAt: string;
}
