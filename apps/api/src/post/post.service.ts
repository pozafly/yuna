import { Injectable, NotFoundException } from '@nestjs/common';
import { CommentTargetType, Role, Visibility } from '@prisma/client';
import {
  CreatePostDto,
  PaginatedResponse,
  PostResponseDto
} from '@yuna/shared-types';
import { AuthorizationService } from '../common/authz/authorization.service';
import {
  toPrismaVisibility,
  toSharedVisibility
} from '../common/utils/enum.util';
import { createId } from '../common/utils/id.util';
import { PrismaService } from '../prisma/prisma.service';

interface PaginationQuery {
  page?: number;
  limit?: number;
}

@Injectable()
export class PostService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authz: AuthorizationService
  ) {}

  async create(userId: string, dto: CreatePostDto): Promise<PostResponseDto> {
    await this.authz.assertOwner(userId, dto.babyId);

    const now = new Date();
    const post = await this.prisma.post.create({
      data: {
        id: createId('post'),
        babyId: dto.babyId,
        authorId: userId,
        content: dto.content,
        visibility: toPrismaVisibility(dto.visibility),
        takenAt: dto.takenAt ? new Date(dto.takenAt) : null,
        mediaUrls: dto.mediaUrls ?? [],
        createdAt: now,
        updatedAt: now
      }
    });

    return this.toResponse(post.id);
  }

  async listByBaby(
    userId: string,
    babyId: string,
    query: PaginationQuery
  ): Promise<PaginatedResponse<PostResponseDto>> {
    const membership = await this.authz.assertCanAccessBaby(userId, babyId);

    const page = query.page && query.page > 0 ? query.page : 1;
    const limit = query.limit && query.limit > 0 ? query.limit : 20;

    const where = {
      babyId,
      ...(membership.role !== Role.OWNER
        ? { visibility: Visibility.INVITED }
        : {})
    };

    const [totalCount, posts] = await this.prisma.$transaction([
      this.prisma.post.count({ where }),
      this.prisma.post.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: { author: true }
      })
    ]);

    const data = await Promise.all(posts.map((post) => this.toResponse(post.id)));

    return {
      success: true,
      data,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / limit))
      }
    };
  }

  async getById(userId: string, postId: string): Promise<PostResponseDto> {
    const post = await this.prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    await this.authz.assertCanReadByVisibility(userId, post.babyId, post.visibility);
    return this.toResponse(post.id);
  }

  private async toResponse(postId: string): Promise<PostResponseDto> {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: { author: true }
    });

    if (!post) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }

    const commentCount = await this.prisma.comment.count({
      where: {
        targetType: CommentTargetType.POST,
        targetId: post.id
      }
    });

    const mediaUrls = Array.isArray(post.mediaUrls)
      ? (post.mediaUrls.filter((url) => typeof url === 'string') as string[])
      : [];

    return {
      id: post.id,
      babyId: post.babyId,
      authorId: post.authorId,
      authorName: post.author.name,
      content: post.content,
      visibility: toSharedVisibility(post.visibility),
      takenAt: post.takenAt ? post.takenAt.toISOString() : null,
      mediaUrls,
      commentCount,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    };
  }
}
