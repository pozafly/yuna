/**
 * Baby 엔티티 — PRD-D 기반
 * 아기 정보 및 삭제 상태/다운로드 만료일 관리
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('babies')
export class Baby {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    gender: string;

    /** 생년월일 — 마일스톤 계산 기준 */
    @Column({ type: 'date', nullable: true })
    birthDate: Date | null;

    @Column({ default: 'ACTIVE' })
    status: string; // ACTIVE | DELETED

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date | null;

    /** 삭제 후 30일 다운로드 가능 마감일 */
    @Column({ type: 'timestamp', nullable: true })
    downloadExpiresAt: Date | null;

    @CreateDateColumn()
    createdAt: Date;
}
