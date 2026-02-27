import {
  ForbiddenException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { CommentTargetType, CreateCommentDto } from '@yuna/shared-types';
import { AuthorizationService } from '../common/authz/authorization.service';
import { toPrismaCommentTargetType } from '../common/utils/enum.util';
import { createId } from '../common/utils/id.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authz: AuthorizationService
  ) {}

  async create(userId: string, dto: CreateCommentDto) {
    if (dto.targetType === CommentTargetType.POST) {
      const post = await this.prisma.post.findUnique({
        where: { id: dto.targetId }
      });
      if (!post) {
        throw new NotFoundException('댓글 대상 게시물을 찾을 수 없습니다.');
      }

      await this.authz.assertCanReadByVisibility(userId, post.babyId, post.visibility);
    }

    if (dto.targetType === CommentTargetType.LETTER) {
      const letter = await this.prisma.letter.findUnique({
        where: { id: dto.targetId }
      });
      if (!letter) {
        throw new NotFoundException('댓글 대상 편지를 찾을 수 없습니다.');
      }

      await this.authz.assertCanReadByVisibility(userId, letter.babyId, letter.visibility);
    }

    const now = new Date();
    const comment = await this.prisma.comment.create({
      data: {
        id: createId('comment'),
        targetType: toPrismaCommentTargetType(dto.targetType),
        targetId: dto.targetId,
        authorId: userId,
        content: dto.content,
        createdAt: now,
        updatedAt: now
      },
      include: {
        author: true
      }
    });

    return {
      id: comment.id,
      targetType: comment.targetType as unknown as CommentTargetType,
      targetId: comment.targetId,
      authorId: comment.authorId,
      authorName: comment.author.name,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString()
    };
  }

  async remove(userId: string, commentId: string) {
    const comment = await this.prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) {
      throw new NotFoundException('댓글을 찾을 수 없습니다.');
    }

    if (comment.authorId !== userId) {
      throw new ForbiddenException('댓글은 작성자 본인만 삭제할 수 있습니다.');
    }

    await this.prisma.comment.delete({ where: { id: commentId } });

    return { deleted: true, commentId };
  }
}
