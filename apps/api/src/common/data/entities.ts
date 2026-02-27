import {
  BabyStatus,
  CommentTargetType,
  InvitationStatus,
  MembershipStatus,
  NotificationType,
  Role,
  Visibility
} from '@yuna/shared-types';

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  status: 'ACTIVE' | 'WITHDRAWN';
  createdAt: string;
}

export interface BabyEntity {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthDate: string | null;
  status: BabyStatus;
  deletedAt: string | null;
  downloadExpiresAt: string | null;
  createdAt: string;
}

export interface BabyMembershipEntity {
  id: string;
  babyId: string;
  userId: string;
  role: Role;
  status: MembershipStatus;
  invitedAt: string;
  joinedAt: string | null;
  blockedAt: string | null;
  withdrawnAt: string | null;
}

export interface InvitationEntity {
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

export interface PostEntity {
  id: string;
  babyId: string;
  authorId: string;
  content: string;
  visibility: Visibility;
  takenAt: string | null;
  mediaUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface LetterEntity {
  id: string;
  babyId: string;
  authorId: string;
  title: string;
  content: string;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
}

export interface CommentEntity {
  id: string;
  targetType: CommentTargetType;
  targetId: string;
  authorId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationEntity {
  id: string;
  recipientId: string;
  type: NotificationType;
  targetType: string;
  targetId: string;
  isRead: boolean;
  createdAt: string;
}

export interface MagicLinkTokenEntity {
  token: string;
  email: string;
  expiresAt: string;
  consumed: boolean;
}

export interface SessionEntity {
  accessToken: string;
  refreshToken: string;
  userId: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
}
