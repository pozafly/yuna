import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../entities';
import type { CreatePostDto, UpdatePostDto } from '@yuna/shared-types';

@Controller()
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('posts')
  create(@CurrentUser() user: User, @Body() dto: CreatePostDto) {
    return this.postService.create(user.id, dto);
  }

  @Get('babies/:babyId/posts')
  findByBaby(
    @Param('babyId') babyId: string,
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.postService.findByBaby(babyId, user.id, page, limit);
  }

  @Get('posts/:id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postService.findOne(id, user.id);
  }

  @Patch('posts/:id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdatePostDto,
  ) {
    return this.postService.update(id, user.id, dto);
  }

  @Delete('posts/:id')
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.postService.remove(id, user.id);
  }
}
