/**
 * BabyMembership 엔티티 — PRD-D 기반
 * Baby와 User 사이의 관계(역할, 상태) 표현
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Baby } from './baby.entity';

@Entity('baby_memberships')
export class BabyMembership {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    babyId: string;

    @Column()
    userId: string;

    /** 역할: OWNER 또는 INVITED */
    @Column()
    role: string; // OWNER | INVITED

    /** 상태: ACTIVE / BLOCKED / WITHDRAWN */
    @Column({ default: 'ACTIVE' })
    status: string;

    @Column({ type: 'timestamp', nullable: true })
    invitedAt: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    joinedAt: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    blockedAt: Date | null;

    @Column({ type: 'timestamp', nullable: true })
    withdrawnAt: Date | null;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @ManyToOne(() => Baby)
    @JoinColumn({ name: 'babyId' })
    baby: Baby;
}
