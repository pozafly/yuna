/**
 * Letter 엔티티 — PRD-D 기반
 * 아기에게 쓰는 편지/타임캡슐 (OWNER/INVITED 모두 작성 가능)
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Baby } from './baby.entity';

@Entity('letters')
export class Letter {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    babyId: string;

    @Column()
    authorId: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    content: string;

    /** 공개 범위: PRIVATE / INVITED */
    @Column({ default: 'INVITED' })
    visibility: string;

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
}
