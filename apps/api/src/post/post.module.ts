import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post, PostMedia, BabyMembership, User } from '../common/entities';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post, PostMedia, BabyMembership, User]),
        AuthModule,
        // StorageModule을 임포트해서 MinIO url 생성 기능 사용
        StorageModule,
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule { }
