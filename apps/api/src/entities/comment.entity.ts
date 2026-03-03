import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TargetType } from '@yuna/shared-types';
import type { User } from './user.entity';
import type { Post } from './post.entity';
import type { Letter } from './letter.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'target_type', type: 'varchar' })
  targetType: TargetType;

  @Column({ name: 'target_id', type: 'uuid' })
  targetId: string;

  @Column({ name: 'author_id' })
  authorId: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne('User', 'comments', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: User;

  @ManyToOne('Post', 'comments', {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'target_id' })
  post: Post | null;

  @ManyToOne('Letter', 'comments', {
    nullable: true,
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'target_id' })
  letter: Letter | null;
}
