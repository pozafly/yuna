import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InvitationStatus } from '@yuna/shared-types';
import type { Baby } from './baby.entity';
import type { User } from './user.entity';

@Entity('invitations')
export class Invitation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'baby_id' })
  babyId: string;

  @Column({ name: 'inviter_id' })
  inviterId: string;

  @Column({ name: 'invitee_email' })
  inviteeEmail: string;

  /** 매직링크용 고유 토큰 */
  @Column({ unique: true })
  token: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expiresAt: Date;

  @Column({
    type: 'varchar',
    default: InvitationStatus.PENDING,
  })
  status: InvitationStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations — 문자열 기반으로 순환 참조 방지
  @ManyToOne('Baby', 'invitations', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'baby_id' })
  baby: Baby;

  @ManyToOne('User', 'sentInvitations', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inviter_id' })
  inviter: User;
}
