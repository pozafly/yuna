/**
 * Comment 엔티티 — PRD-D 기반
 * 다형성 댓글 (Post 또는 Letter에 달림)
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('comments')
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /** 댓글 대상 유형: POST / LETTER */
    @Column()
    targetType: string;

    /** 대상 Post 또는 Letter의 id */
    @Column()
    targetId: string;

    @Column()
    authorId: string;

    @Column({ type: 'text' })
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'authorId' })
    author: User;
}
