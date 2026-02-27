/**
 * Invitation 엔티티 — PRD-D 기반
 * 초대 토큰, 만료 시간, 상태 관리
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Baby } from './baby.entity';

@Entity('invitations')
export class Invitation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    babyId: string;

    /** 초대를 발송한 OWNER */
    @Column()
    inviterId: string;

    /** 초대받는 사람의 이메일 */
    @Column()
    inviteeEmail: string;

    /** 초대할 역할 (OWNER / INVITED) */
    @Column({ default: 'INVITED' })
    role: string;

    /** 일회용 초대 토큰 */
    @Column({ unique: true })
    token: string;

    /** 토큰 만료 일시 (발송 후 30분) */
    @Column({ type: 'timestamp' })
    expiresAt: Date;

    /** 상태: PENDING / ACCEPTED / EXPIRED / CANCELLED */
    @Column({ default: 'PENDING' })
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Baby)
    @JoinColumn({ name: 'babyId' })
    baby: Baby;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'inviterId' })
    inviter: User;
}
