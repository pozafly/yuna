import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res
} from '@nestjs/common';
import { MagicLinkRequestDto } from '@yuna/shared-types';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'strict' as const,
    path: '/'
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('magic-link')
  async requestMagicLink(@Body() body: MagicLinkRequestDto) {
    return this.authService.requestMagicLink(body);
  }

  @Get('magic-link/verify')
  async verifyMagicLink(@Query('token') token: string, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyMagicLink(token);
    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return {
      success: true,
      data: result.user,
      message: '로그인에 성공했습니다.'
    };
  }

  @Get('invite/verify')
  async verifyInvite(@Query('token') token: string, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyInvitation(token);
    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return {
      success: true,
      data: result.user,
      message: '초대 수락이 완료되었습니다.'
    };
  }

  @Get('google')
  startGoogleOAuth(@Res() res: Response) {
    res.redirect('/auth/google/callback?email=google.user%40yuna.local');
  }

  @Get('google/callback')
  async googleCallback(
    @Query('email') email = 'google.user@yuna.local',
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.socialLogin(email);
    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return {
      success: true,
      data: result.user,
      message: 'Google 로그인 처리 완료'
    };
  }

  @Get('naver')
  startNaverOAuth(@Res() res: Response) {
    res.redirect('/auth/naver/callback?email=naver.user%40yuna.local');
  }

  @Get('naver/callback')
  async naverCallback(
    @Query('email') email = 'naver.user@yuna.local',
    @Res({ passthrough: true }) res: Response
  ) {
    const result = await this.authService.socialLogin(email);
    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return {
      success: true,
      data: result.user,
      message: 'Naver 로그인 처리 완료'
    };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('refreshToken') fallbackRefreshToken?: string
  ) {
    const refreshToken = req.cookies?.refreshToken ?? fallbackRefreshToken;
    const result = await this.authService.refreshSession(refreshToken);
    res.cookie('accessToken', result.accessToken, {
      ...cookieOptions(),
      maxAge: 15 * 60 * 1000
    });
    res.cookie('refreshToken', result.refreshToken, {
      ...cookieOptions(),
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    return {
      success: true,
      data: { refreshed: true }
    };
  }

  @Post('logout')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query('accessToken') fallbackAccessToken?: string,
    @Query('refreshToken') fallbackRefreshToken?: string
  ) {
    const accessToken = req.cookies?.accessToken ?? fallbackAccessToken;
    const refreshToken = req.cookies?.refreshToken ?? fallbackRefreshToken;
    await this.authService.logout(accessToken, refreshToken);
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });

    return {
      success: true,
      data: { logout: true }
    };
  }

  @Get('dev/owner-token')
  async devOwnerToken() {
    return {
      success: true,
      data: await this.authService.getDevOwnerToken()
    };
  }

  @Get('dev/invited-token')
  async devInvitedToken() {
    return {
      success: true,
      data: await this.authService.getDevInvitedToken()
    };
  }
}
