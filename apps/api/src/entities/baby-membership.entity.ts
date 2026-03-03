import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Role, MembershipStatus } from '@yuna/shared-types';
import type { Baby } from './baby.entity';
import type { User } from './user.entity';

@Entity('baby_memberships')
@Unique(['babyId', 'userId'])
export class BabyMembership {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'baby_id' })
  babyId: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar' })
  role: Role;

  @Column({
    type: 'varchar',
    default: MembershipStatus.ACTIVE,
  })
  status: MembershipStatus;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;

  @Column({ name: 'blocked_at', nullable: true, type: 'timestamp' })
  blockedAt: Date | null;

  @Column({ name: 'withdrawn_at', nullable: true, type: 'timestamp' })
  withdrawnAt: Date | null;

  // Relations — 문자열 기반으로 순환 참조 방지
  @ManyToOne('Baby', 'memberships', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'baby_id' })
  baby: Baby;

  @ManyToOne('User', 'memberships', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
