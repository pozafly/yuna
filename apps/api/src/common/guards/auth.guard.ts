/**
 * Auth 가드 — 모든 보호 API에서 사용
 * Cookie에서 accessToken을 추출하여 사용자 인증 확인
 */
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = req.cookies?.accessToken;

        if (!token) {
            throw new UnauthorizedException('인증이 필요합니다.');
        }

        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepo.findOne({ where: { id: payload.sub } });

            if (!user || user.status !== 'ACTIVE') {
                throw new UnauthorizedException('유효하지 않은 사용자입니다.');
            }

            // req.user에 사용자 정보 주입
            req.user = user;
            return true;
        } catch {
            throw new UnauthorizedException('유효하지 않은 토큰입니다.');
        }
    }
}
