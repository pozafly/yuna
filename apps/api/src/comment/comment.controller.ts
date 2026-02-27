import { Body, Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { CreateCommentDto } from '@yuna/shared-types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestUser } from '../common/types/request-user.type';
import { CommentService } from './comment.service';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  async create(@CurrentUser() user: RequestUser, @Body() body: CreateCommentDto) {
    return {
      success: true,
      data: await this.commentService.create(user.id, body)
    };
  }

  @Delete(':id')
  async remove(@CurrentUser() user: RequestUser, @Param('id') commentId: string) {
    return {
      success: true,
      data: await this.commentService.remove(user.id, commentId)
    };
  }
}
