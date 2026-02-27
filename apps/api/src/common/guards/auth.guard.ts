import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { RequestUser } from '../types/request-user.type';

interface RequestShape {
  headers: Record<string, string | undefined>;
  cookies?: Record<string, string | undefined>;
  user?: RequestUser;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestShape>();
    const headerUserId = request.headers['x-user-id'];
    const allowDevHeaderAuth = process.env.ALLOW_DEV_HEADER_AUTH === 'true';

    // 개발/테스트 편의를 위한 헤더 인증 우회는 명시적으로 활성화된 경우에만 허용합니다.
    if (allowDevHeaderAuth && headerUserId) {
      const user = await this.prisma.user.findFirst({
        where: {
          id: headerUserId,
          status: UserStatus.ACTIVE
        }
      });

      if (!user) {
        throw new UnauthorizedException('유효하지 않은 x-user-id 입니다.');
      }

      request.user = { id: user.id, email: user.email, name: user.name };
      return true;
    }

    const accessToken = request.cookies?.accessToken;
    if (!accessToken) {
      throw new UnauthorizedException('인증 정보가 없습니다.');
    }

    // 쿠키 세션은 access token 만료 시 즉시 차단되어야 하므로,
    // 토큰 존재 여부와 만료 시점을 함께 확인합니다.
    const session = await this.prisma.session.findFirst({
      where: {
        accessToken,
        accessExpiresAt: {
          gt: new Date()
        }
      }
    });

    if (!session) {
      throw new UnauthorizedException('세션이 만료되었습니다.');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        id: session.userId,
        status: UserStatus.ACTIVE
      }
    });

    if (!user) {
      throw new UnauthorizedException('활성 사용자만 접근할 수 있습니다.');
    }

    request.user = { id: user.id, email: user.email, name: user.name };
    return true;
  }
}
