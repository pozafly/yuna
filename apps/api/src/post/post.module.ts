import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post, PostMedia, BabyMembership, Baby, Like } from '../entities';
import { AuthModule } from '../auth/auth.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, PostMedia, BabyMembership, Baby, Like]),
    AuthModule,
    StorageModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
