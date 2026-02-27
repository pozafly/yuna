import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BabyModule } from './baby/baby.module';
import { CommentModule } from './comment/comment.module';
import { CommonModule } from './common/common.module';
import { LetterModule } from './letter/letter.module';
import { NotificationModule } from './notification/notification.module';
import { PostModule } from './post/post.module';
import { StorageModule } from './storage/storage.module';
import { InvitationModule } from './invitation/invitation.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    BabyModule,
    InvitationModule,
    PostModule,
    LetterModule,
    CommentModule,
    NotificationModule,
    StorageModule
  ]
})
export class AppModule {}
