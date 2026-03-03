import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import { TargetType } from '@yuna/shared-types';
import type { CreateCommentDto } from '@yuna/shared-types';

@Controller()
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comments')
  create(@CurrentUser() user: User, @Body() dto: CreateCommentDto) {
    return this.commentService.create(user.id, dto);
  }

  @Get('posts/:id/comments')
  findByPost(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentService.findByTarget(TargetType.POST, id, user.id);
  }

  @Get('letters/:id/comments')
  findByLetter(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentService.findByTarget(TargetType.LETTER, id, user.id);
  }

  @Delete('comments/:id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.commentService.remove(id, user.id);
  }
}
