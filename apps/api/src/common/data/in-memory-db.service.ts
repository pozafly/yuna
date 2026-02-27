import { Injectable } from '@nestjs/common';
import {
  BabyStatus,
  InvitationStatus,
  MembershipStatus,
  NotificationType,
  Role,
  Visibility
} from '@yuna/shared-types';
import {
  BabyEntity,
  BabyMembershipEntity,
  CommentEntity,
  InvitationEntity,
  LetterEntity,
  MagicLinkTokenEntity,
  NotificationEntity,
  PostEntity,
  SessionEntity,
  UserEntity
} from './entities';

function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function plusMinutes(minutes: number): string {
  return new Date(Date.now() + minutes * 60 * 1000).toISOString();
}

function plusDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

@Injectable()
export class InMemoryDbService {
  users: UserEntity[] = [];
  babies: BabyEntity[] = [];
  memberships: BabyMembershipEntity[] = [];
  invitations: InvitationEntity[] = [];
  posts: PostEntity[] = [];
  letters: LetterEntity[] = [];
  comments: CommentEntity[] = [];
  notifications: NotificationEntity[] = [];
  magicLinkTokens: MagicLinkTokenEntity[] = [];
  sessions: SessionEntity[] = [];

  constructor() {
    const ownerUser: UserEntity = {
      id: 'user_owner',
      email: 'owner@yuna.local',
      name: 'Yuna Owner',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    const invitedUser: UserEntity = {
      id: 'user_invited',
      email: 'invited@yuna.local',
      name: 'Yuna Family',
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    const baby: BabyEntity = {
      id: 'baby_seed',
      name: 'Yuna',
      gender: 'FEMALE',
      birthDate: null,
      status: BabyStatus.ACTIVE,
      deletedAt: null,
      downloadExpiresAt: null,
      createdAt: new Date().toISOString()
    };

    this.users.push(ownerUser, invitedUser);
    this.babies.push(baby);

    this.memberships.push(
      {
        id: createId('memb'),
        babyId: baby.id,
        userId: ownerUser.id,
        role: Role.OWNER,
        status: MembershipStatus.ACTIVE,
        invitedAt: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        blockedAt: null,
        withdrawnAt: null
      },
      {
        id: createId('memb'),
        babyId: baby.id,
        userId: invitedUser.id,
        role: Role.INVITED,
        status: MembershipStatus.ACTIVE,
        invitedAt: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        blockedAt: null,
        withdrawnAt: null
      }
    );

    const welcomePost: PostEntity = {
      id: createId('post'),
      babyId: baby.id,
      authorId: ownerUser.id,
      content: 'Yuna에 오신 걸 환영해요.',
      visibility: Visibility.INVITED,
      takenAt: null,
      mediaUrls: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.posts.push(welcomePost);

    this.notifications.push({
      id: createId('noti'),
      recipientId: invitedUser.id,
      type: NotificationType.NEW_POST,
      targetType: 'POST',
      targetId: welcomePost.id,
      isRead: false,
      createdAt: new Date().toISOString()
    });
  }

  nowIso(): string {
    return new Date().toISOString();
  }

  createId(prefix: string): string {
    return createId(prefix);
  }

  createSession(userId: string): SessionEntity {
    const session: SessionEntity = {
      accessToken: createId('at'),
      refreshToken: createId('rt'),
      userId,
      accessExpiresAt: plusMinutes(15),
      refreshExpiresAt: plusDays(30)
    };

    this.sessions.push(session);
    return session;
  }

  createMagicLink(email: string): MagicLinkTokenEntity {
    const token: MagicLinkTokenEntity = {
      token: createId('magic'),
      email,
      expiresAt: plusMinutes(30),
      consumed: false
    };

    this.magicLinkTokens.push(token);
    return token;
  }

  createInvitationToken(params: {
    babyId: string;
    inviterId: string;
    inviteeEmail: string;
    role: Role;
  }): InvitationEntity {
    const invitation: InvitationEntity = {
      id: createId('inv'),
      babyId: params.babyId,
      inviterId: params.inviterId,
      inviteeEmail: params.inviteeEmail,
      role: params.role,
      token: createId('invtoken'),
      expiresAt: plusMinutes(30),
      status: InvitationStatus.PENDING,
      createdAt: this.nowIso()
    };

    this.invitations.push(invitation);
    return invitation;
  }
}
