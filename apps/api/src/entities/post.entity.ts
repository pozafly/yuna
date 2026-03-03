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
import type { PostMedia } from './post-media.entity';
import type { Comment } from './comment.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'baby_id' })
  babyId: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar' })
  visibility: Visibility;

  @Column({ name: 'taken_at', nullable: true, type: 'timestamp' })
  takenAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations — 문자열 기반으로 순환 참조 방지
  @ManyToOne('Baby', 'posts', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'baby_id' })
  baby: Baby;

  @ManyToOne('User', 'posts', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @OneToMany('PostMedia', 'post', { cascade: true })
  media: PostMedia[];

  @OneToMany('Comment', 'post')
  comments: Comment[];
}
