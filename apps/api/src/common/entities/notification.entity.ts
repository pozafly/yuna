/**
 * Notification 엔티티 — PRD-D 기반
 * 앱 내 알림 (새 게시물, 댓글, 편지, 초대)
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    recipientId: string;

    /** 알림 유형: NEW_POST / NEW_COMMENT / NEW_LETTER / INVITATION */
    @Column()
    type: string;

    /** 알림 관련 개체 유형 */
    @Column()
    targetType: string;

    /** 알림 관련 개체 id */
    @Column()
    targetId: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'recipientId' })
    recipient: User;
}
