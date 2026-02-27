import { Controller, Post, Get, Body, Param, Query, UseGuards, Put } from '@nestjs/common';
import { PostService } from './post.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostController {
    constructor(private readonly postService: PostService) { }

    /** 1단계: 게시물 생성 요청 (Presigned URL 발급) */
    @Post('request-upload')
    async requestUpload(
        @CurrentUser() user: User,
        @Body() body: { babyId: string; fileCount: number; content: string; visibility: string; takenAt?: string }
    ) {
        const data = await this.postService.requestUpload(user.id, body);
        return { success: true, data };
    }

    /** 2단계: 업로드 완료 확인 (Media 레코드 기록) */
    @Post(':id/confirm-upload')
    async confirmUpload(
        @Param('id') id: string,
        @CurrentUser() user: User,
        @Body() body: { media: { storageKey: string; order: number }[] }
    ) {
        await this.postService.confirmUpload(user.id, id, body.media);
        return { success: true, message: '게시물 작성이 완료되었습니다.' };
    }

    /** 피드 목록 조회 */
    @Get('baby/:babyId')
    async getFeed(
        @Param('babyId') babyId: string,
        @CurrentUser() user: User,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const data = await this.postService.getFeed(babyId, user.id, Number(page || 1), Number(limit || 20));
        return { success: true, data: data.posts, total: data.total };
    }
}
