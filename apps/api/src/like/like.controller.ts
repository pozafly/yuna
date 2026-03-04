import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';

@Controller()
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  /** 좋아요 토글: POST /babies/:babyId/posts/:postId/likes */
  @Post('babies/:babyId/posts/:postId/likes')
  toggle(
    @Param('babyId') babyId: string,
    @Param('postId') postId: string,
    @CurrentUser() user: User,
  ) {
    return this.likeService.toggle(user.id, babyId, postId);
  }
}
