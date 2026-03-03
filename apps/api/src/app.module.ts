import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true, // 개발 전용 — 프로덕션에서는 migration 사용
    }),
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
export class AppModule {}
