/**
 * Yuna API — 루트 모듈
 * 모든 기능 모듈과 인프라(DB, 환경변수)를 등록합니다.
 */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BabyModule } from './baby/baby.module';
import { InvitationModule } from './invitation/invitation.module';
import { PostModule } from './post/post.module';
import { LetterModule } from './letter/letter.module';
import { CommentModule } from './comment/comment.module';
import { NotificationModule } from './notification/notification.module';
import { StorageModule } from './storage/storage.module';

@Module({
    imports: [
        // 환경변수 글로벌 로드
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),

        // TypeORM — PostgreSQL 연결 설정
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DATABASE_HOST', 'localhost'),
                port: config.get<number>('DATABASE_PORT', 5432),
                username: config.get('DATABASE_USER', 'yuna_user'),
                password: config.get('DATABASE_PASSWORD', 'yuna_secret'),
                database: config.get('DATABASE_NAME', 'yuna_dev'),
                autoLoadEntities: true, // 엔티티 자동 탐색
                synchronize: true, // 개발 환경에서만 사용 (운영에서는 migration 사용)
                logging: false,
            }),
        }),

        // 기능 모듈
        AuthModule,
        BabyModule,
        InvitationModule,
        PostModule,
        LetterModule,
        CommentModule,
        NotificationModule,
        StorageModule,
    ],
})
export class AppModule { }
