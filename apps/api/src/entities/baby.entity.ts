import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { BabyStatus } from '@yuna/shared-types';
import type { BabyMembership } from './baby-membership.entity';
import type { Post } from './post.entity';
import type { Letter } from './letter.entity';
import type { Invitation } from './invitation.entity';

@Entity('babies')
export class Baby {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  gender: string | null;

  @Column({ name: 'birth_date', nullable: true, type: 'date' })
  birthDate: string | null;

  @Column({
    type: 'varchar',
    default: BabyStatus.ACTIVE,
  })
  status: BabyStatus;

  /** Baby 삭제 시각 */
  @Column({ name: 'deleted_at', nullable: true, type: 'timestamp' })
  deletedAt: Date | null;

  /** 아카이브 다운로드 만료 시각 (삭제 후 30일) */
  @Column({ name: 'download_expires_at', nullable: true, type: 'timestamp' })
  downloadExpiresAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations — 문자열 기반으로 순환 참조 방지
  @OneToMany('BabyMembership', 'baby')
  memberships: BabyMembership[];

  @OneToMany('Post', 'baby')
  posts: Post[];

  @OneToMany('Letter', 'baby')
  letters: Letter[];

  @OneToMany('Invitation', 'baby')
  invitations: Invitation[];
}
