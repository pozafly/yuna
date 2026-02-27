/**
 * User 엔티티 — PRD-D 기반
 * 이메일 기반 식별, 비밀번호는 해시 저장, 상태(ACTIVE/WITHDRAWN) 관리
 */
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    /** 비밀번호 해시 — 소셜로그인 사용자는 null 가능 */
    @Column({ nullable: true })
    password: string | null;

    @Column({ default: 'ACTIVE' })
    status: string; // ACTIVE | WITHDRAWN

    @CreateDateColumn()
    createdAt: Date;
}
