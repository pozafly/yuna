import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards
} from '@nestjs/common';
import { CreatePostDto } from '@yuna/shared-types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthGuard } from '../common/guards/auth.guard';
import { RequestUser } from '../common/types/request-user.type';
import { PostService } from './post.service';

@Controller()
@UseGuards(AuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('babies/:babyId/posts')
  async listByBaby(
    @CurrentUser() user: RequestUser,
    @Param('babyId') babyId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.postService.listByBaby(user.id, babyId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined
    });
  }

  @Post('posts')
  async create(@CurrentUser() user: RequestUser, @Body() body: CreatePostDto) {
    return {
      success: true,
      data: await this.postService.create(user.id, body)
    };
  }

  @Get('posts/:id')
  async getById(@CurrentUser() user: RequestUser, @Param('id') postId: string) {
    return {
      success: true,
      data: await this.postService.getById(user.id, postId)
    };
  }
}
