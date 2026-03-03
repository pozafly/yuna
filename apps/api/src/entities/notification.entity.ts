import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { NotificationType } from '@yuna/shared-types';
import type { User } from './user.entity';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'recipient_id' })
  recipientId: string;

  @Column({ type: 'varchar' })
  type: NotificationType;

  /** 대상 타입 (POST / LETTER) */
  @Column({ name: 'target_type', type: 'varchar' })
  targetType: string;

  /** 대상 ID */
  @Column({ name: 'target_id', type: 'uuid' })
  targetId: string;

  @Column({ name: 'is_read', default: false })
  isRead: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations — 문자열 기반으로 순환 참조 방지
  @ManyToOne('User', 'notifications', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'recipient_id' })
  recipient: User;
}
