/**
 * Auth 컨트롤러 — 매직링크 요청/검증, 로그인/로그아웃, 현재 사용자 조회
 * Cookie 기반 세션: HttpOnly, Secure, SameSite=Strict
 */
import { Controller, Post, Get, Body, Query, Res, Req, UnauthorizedException } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    /** 매직링크 요청 — 이메일로 매직링크 발송 */
    @Post('magic-link')
    async requestMagicLink(@Body('email') email: string) {
        await this.authService.requestMagicLink(email);
        return { success: true, message: '매직링크가 이메일로 발송되었습니다.' };
    }

    /** 매직링크 검증 → Cookie 발급 → 피드로 리다이렉트 */
    @Get('magic-link/verify')
    async verifyMagicLink(@Query('token') token: string, @Res() res: Response) {
        const { accessToken, refreshToken, user } = await this.authService.verifyMagicLink(token);

        // HttpOnly Cookie 설정 — TECH-B 보안 정책 준수
        this.setAuthCookies(res, accessToken, refreshToken);

        return res.json({ success: true, data: { id: user.id, email: user.email, name: user.name } });
    }

    /** 현재 사용자 정보 조회 */
    @Get('me')
    async getMe(@Req() req: Request) {
        const token = req.cookies?.accessToken;
        if (!token) throw new UnauthorizedException('인증이 필요합니다.');

        const user = await this.authService.validateToken(token);
        return { success: true, data: { id: user.id, email: user.email, name: user.name } };
    }

    /** 로그아웃 — Cookie 삭제 */
    @Post('logout')
    async logout(@Res() res: Response) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.json({ success: true, message: '로그아웃 완료' });
    }

    /** 토큰 갱신 — refreshToken으로 새 accessToken 발급 */
    @Post('refresh')
    async refresh(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) throw new UnauthorizedException('인증이 필요합니다.');

        const user = await this.authService.validateToken(refreshToken);
        const tokens = this.authService.generateTokens(user);
        this.setAuthCookies(res, tokens.accessToken, tokens.refreshToken);

        return res.json({ success: true, data: { id: user.id, email: user.email, name: user.name } });
    }

    /** 인증 Cookie 설정 — HttpOnly, Secure, SameSite=Strict */
    private setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15분
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
        });
    }
}
