import {
  BabyStatus as PrismaBabyStatus,
  CommentTargetType as PrismaCommentTargetType,
  InvitationStatus as PrismaInvitationStatus,
  MembershipStatus as PrismaMembershipStatus,
  NotificationType as PrismaNotificationType,
  Role as PrismaRole,
  Visibility as PrismaVisibility
} from '@prisma/client';
import {
  BabyStatus,
  CommentTargetType,
  InvitationStatus,
  MembershipStatus,
  NotificationType,
  Role,
  Visibility
} from '@yuna/shared-types';

export function toSharedRole(value: PrismaRole): Role {
  return Role[value as keyof typeof Role];
}

export function toPrismaRole(value: Role): PrismaRole {
  return value as unknown as PrismaRole;
}

export function toSharedVisibility(value: PrismaVisibility): Visibility {
  return Visibility[value as keyof typeof Visibility];
}

export function toPrismaVisibility(value: Visibility): PrismaVisibility {
  return value as unknown as PrismaVisibility;
}

export function toSharedInvitationStatus(
  value: PrismaInvitationStatus
): InvitationStatus {
  return InvitationStatus[value as keyof typeof InvitationStatus];
}

export function toPrismaInvitationStatus(
  value: InvitationStatus
): PrismaInvitationStatus {
  return value as unknown as PrismaInvitationStatus;
}

export function toSharedBabyStatus(value: PrismaBabyStatus): BabyStatus {
  return BabyStatus[value as keyof typeof BabyStatus];
}

export function toPrismaBabyStatus(value: BabyStatus): PrismaBabyStatus {
  return value as unknown as PrismaBabyStatus;
}

export function toSharedNotificationType(
  value: PrismaNotificationType
): NotificationType {
  return NotificationType[value as keyof typeof NotificationType];
}

export function toPrismaNotificationType(
  value: NotificationType
): PrismaNotificationType {
  return value as unknown as PrismaNotificationType;
}

export function toPrismaMembershipStatus(
  value: MembershipStatus
): PrismaMembershipStatus {
  return value as unknown as PrismaMembershipStatus;
}

export function toPrismaCommentTargetType(
  value: CommentTargetType
): PrismaCommentTargetType {
  return value as unknown as PrismaCommentTargetType;
}
