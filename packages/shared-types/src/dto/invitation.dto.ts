import { InvitationStatus } from '../enums';

export interface CreateInvitationDto {
  babyId: string;
  inviteeEmail: string;
}

export interface InvitationResponseDto {
  id: string;
  babyId: string;
  inviterId: string;
  inviteeEmail: string;
  status: InvitationStatus;
  expiresAt: string;
  createdAt: string;
}
