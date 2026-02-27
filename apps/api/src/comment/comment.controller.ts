import { Controller, Post, Get, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../common/entities';

@Controller('comments')
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    async create(@CurrentUser() user: User, @Body() body: { targetType: string; targetId: string; content: string }) {
        const comment = await this.commentService.create(user.id, body);
        return { success: true, data: comment };
    }

    @Get(':targetType/:targetId')
    async findAllByTarget(
        @Param('targetType') targetType: string,
        @Param('targetId') targetId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const data = await this.commentService.findAllByTarget(targetType, targetId, Number(page || 1), Number(limit || 50));
        return { success: true, data: data.comments, total: data.total };
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @CurrentUser() user: User) {
        await this.commentService.remove(id, user.id);
        return { success: true, message: '댓글이 삭제되었습니다.' };
    }
}
