import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Res,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';

/** Cookie 설정 헬퍼 */
function setCookies(
  res: Response,
  tokens: { accessToken: string; refreshToken: string },
) {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 15 * 60 * 1000, // 15분
  });
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30일
  });
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /** 개발 환경 전용: 자동 로그인 (테스트 유저 생성 + 쿠키 발급) */
  @Post('dev-login')
  @HttpCode(200)
  async devLogin(@Res({ passthrough: true }) res: Response) {
    if (process.env.NODE_ENV === 'production') {
      return { message: 'Not available in production' };
    }
    const result = await this.authService.devLogin();
    setCookies(res, result);
    return result.user;
  }

  /** 매직링크 발송 */
  @Post('magic-link')
  @HttpCode(200)
  async sendMagicLink(@Body('email') email: string) {
    return this.authService.sendMagicLink(email);
  }

  /** 매직링크 검증 → Cookie 발급 → FE 리다이렉트 */
  @Get('magic-link/verify')
  async verifyMagicLink(
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    const result = await this.authService.verifyMagicLink(token);
    setCookies(res, result);
    res.redirect(process.env.APP_URL || 'http://localhost:3001');
  }

  /** 초대 토큰으로 신규 사용자 등록 */
  @Post('register')
  async register(
    @Body('name') name: string,
    @Body('token') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.register(name, token);
    setCookies(res, result);
    return result.user;
  }

  /** 초대 수락 (기존 사용자) */
  @Post('accept-invitation')
  @UseGuards(JwtAuthGuard)
  async acceptInvitation(
    @CurrentUser() user: User,
    @Body('token') token: string,
  ) {
    return this.authService.acceptInvitation(user.id, token);
  }

  /** 토큰 갱신 */
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return { success: false, message: '리프레시 토큰이 없습니다' };
    }
    const result = await this.authService.refresh(refreshToken);
    setCookies(res, result);
    return result.user;
  }

  /** 로그아웃 */
  @Post('logout')
  @HttpCode(200)
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    return { message: '로그아웃 되었습니다' };
  }

  /** 현재 사용자 정보 */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@CurrentUser() user: User) {
    return this.authService.getMe(user.id);
  }
}
