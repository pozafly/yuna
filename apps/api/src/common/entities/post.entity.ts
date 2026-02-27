/**
 * Post 엔티티 — PRD-D 기반
 * 사진 피드 게시물 (OWNER만 작성 가능, visibility 제어)
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Baby } from './baby.entity';
import { PostMedia } from './post-media.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    babyId: string;

    @Column()
    authorId: string;

    @Column({ type: 'text', default: '' })
    content: string;

    /** 공개 범위: PRIVATE(OWNER만) / INVITED(초대된 모두) */
    @Column({ default: 'INVITED' })
    visibility: string;

    /** 사진 촬영 날짜 — 아카이브·마일스톤 기준 */
    @Column({ type: 'date', nullable: true })
    takenAt: Date | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Baby)
    @JoinColumn({ name: 'babyId' })
    baby: Baby;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'authorId' })
    author: User;

    @OneToMany(() => PostMedia, (media) => media.post)
    media: PostMedia[];
}
