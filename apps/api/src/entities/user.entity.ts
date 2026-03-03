import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { UserStatus } from '@yuna/shared-types';
import type { OAuthProvider } from './oauth-provider.entity';
import type { BabyMembership } from './baby-membership.entity';
import type { Post } from './post.entity';
import type { Letter } from './letter.entity';
import type { Comment } from './comment.entity';
import type { Notification } from './notification.entity';
import type { Invitation } from './invitation.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  /** 소셜 로그인 전용 계정은 null */
  @Column({ name: 'password_hash', nullable: true, type: 'varchar' })
  passwordHash: string | null;

  @Column({
    type: 'varchar',
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations — 문자열 기반으로 순환 참조 방지
  @OneToMany('OAuthProvider', 'user')
  oauthProviders: OAuthProvider[];

  @OneToMany('BabyMembership', 'user')
  memberships: BabyMembership[];

  @OneToMany('Post', 'author')
  posts: Post[];

  @OneToMany('Letter', 'author')
  letters: Letter[];

  @OneToMany('Comment', 'author')
  comments: Comment[];

  @OneToMany('Notification', 'recipient')
  notifications: Notification[];

  @OneToMany('Invitation', 'inviter')
  sentInvitations: Invitation[];
}
