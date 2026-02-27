/**
 * PostMedia 엔티티 — PRD-D 기반
 * 게시물에 첨부된 사진 (Carousel 순서 관리)
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './post.entity';

@Entity('post_media')
export class PostMedia {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    postId: string;

    /** MinIO 오브젝트 저장 경로/키 — originals/{babyId}/{postId}/{uuid}.{ext} */
    @Column()
    storageKey: string;

    /** Carousel 내 사진 순서 */
    @Column({ default: 0 })
    order: number;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Post, (post) => post.media)
    @JoinColumn({ name: 'postId' })
    post: Post;
}
