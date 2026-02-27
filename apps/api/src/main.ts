/**
 * Yuna API — NestJS 진입점
 * Cookie 기반 인증, CORS 설정, 글로벌 파이프(검증) 적용
 */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Cookie 파서 — HttpOnly Cookie 기반 인증에 필수
    app.use(cookieParser());

    // CORS — 프론트엔드(Next.js)에서 Cookie 전송을 위해 credentials 허용
    app.enableCors({
        origin: process.env.APP_URL || 'http://localhost:3001',
        credentials: true,
    });

    // 글로벌 유효성 검증 파이프
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true, // DTO에 정의되지 않은 속성 자동 제거
            forbidNonWhitelisted: true, // 정의되지 않은 속성 전송 시 에러
            transform: true, // 자동 타입 변환
        }),
    );

    const port = process.env.API_PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Yuna API server running on http://localhost:${port}`);
}
bootstrap();
