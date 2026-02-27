/**
 * Auth 서비스 — 매직링크 발송, 토큰 검증, JWT 발급, 회원가입
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../common/entities';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
        private readonly jwtService: JwtService,
    ) { }

    /** 매직링크 요청 — 이메일로 매직링크 발송 (개발: 콘솔 출력) */
    async requestMagicLink(email: string): Promise<{ token: string }> {
        // 매직링크 토큰 생성 (30분 만료)
        const token = this.jwtService.sign(
            { email, type: 'magic-link' },
            { expiresIn: '30m' },
        );
        // TODO: 실제 이메일 발송 (현재는 콘솔 출력)
        console.log(`📧 Magic link for ${email}: /auth/magic-link/verify?token=${token}`);
        return { token };
    }

    /** 매직링크 검증 → 사용자 조회/생성 → JWT 발급 */
    async verifyMagicLink(token: string): Promise<{ accessToken: string; refreshToken: string; user: User }> {
        try {
            const payload = this.jwtService.verify(token);
            if (payload.type !== 'magic-link') throw new UnauthorizedException('잘못된 토큰 유형');

            let user = await this.userRepo.findOne({ where: { email: payload.email } });
            if (!user) {
                // 신규 사용자 — 임시 이름으로 생성 (이후 프로필 설정에서 변경)
                user = this.userRepo.create({ email: payload.email, name: payload.email.split('@')[0] });
                await this.userRepo.save(user);
            }

            const tokens = this.generateTokens(user);
            return { ...tokens, user };
        } catch {
            throw new UnauthorizedException('유효하지 않거나 만료된 매직링크입니다.');
        }
    }

    /** Access + Refresh 토큰 쌍 생성 */
    generateTokens(user: User): { accessToken: string; refreshToken: string } {
        const payload = { sub: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload, { expiresIn: '15m' }),
            refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
        };
    }

    /** JWT 토큰에서 사용자 조회 */
    async validateToken(token: string): Promise<User> {
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepo.findOne({ where: { id: payload.sub } });
            if (!user || user.status !== 'ACTIVE') {
                throw new UnauthorizedException('유효하지 않은 사용자');
            }
            return user;
        } catch {
            throw new UnauthorizedException('유효하지 않은 토큰');
        }
    }

    /** 사용자 조회 by ID */
    async findById(id: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { id } });
    }
}
