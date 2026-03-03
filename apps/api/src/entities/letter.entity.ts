import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Visibility } from '@yuna/shared-types';
import type { Baby } from './baby.entity';
import type { User } from './user.entity';
import type { Comment } from './comment.entity';

@Entity('letters')
export class Letter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'baby_id' })
  babyId: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar' })
  visibility: Visibility;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations — 문자열 기반으로 순환 참조 방지
  @ManyToOne('Baby', 'letters', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'baby_id' })
  baby: Baby;

  @ManyToOne('User', 'letters', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany('Comment', 'letter')
  comments: Comment[];
}
