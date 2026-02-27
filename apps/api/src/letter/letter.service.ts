import { Injectable, NotFoundException } from '@nestjs/common';
import { Role, Visibility } from '@prisma/client';
import {
  CreateLetterDto,
  LetterResponseDto,
  PaginatedResponse
} from '@yuna/shared-types';
import { AuthorizationService } from '../common/authz/authorization.service';
import {
  toPrismaVisibility,
  toSharedVisibility
} from '../common/utils/enum.util';
import { createId } from '../common/utils/id.util';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LetterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authz: AuthorizationService
  ) {}

  async create(userId: string, dto: CreateLetterDto): Promise<LetterResponseDto> {
    await this.authz.assertCanAccessBaby(userId, dto.babyId);

    const now = new Date();
    const letter = await this.prisma.letter.create({
      data: {
        id: createId('letter'),
        babyId: dto.babyId,
        authorId: userId,
        title: dto.title,
        content: dto.content,
        visibility: toPrismaVisibility(dto.visibility),
        createdAt: now,
        updatedAt: now
      }
    });

    return this.toResponse(letter.id);
  }

  async listByBaby(
    userId: string,
    babyId: string,
    page = 1,
    limit = 20
  ): Promise<PaginatedResponse<LetterResponseDto>> {
    const membership = await this.authz.assertCanAccessBaby(userId, babyId);

    const normalizedPage = page > 0 ? page : 1;
    const normalizedLimit = limit > 0 ? limit : 20;

    const where = {
      babyId,
      ...(membership.role !== Role.OWNER
        ? { visibility: Visibility.INVITED }
        : {})
    };

    const [totalCount, letters] = await this.prisma.$transaction([
      this.prisma.letter.count({ where }),
      this.prisma.letter.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (normalizedPage - 1) * normalizedLimit,
        take: normalizedLimit
      })
    ]);

    const data = await Promise.all(letters.map((letter) => this.toResponse(letter.id)));

    return {
      success: true,
      data,
      pagination: {
        page: normalizedPage,
        limit: normalizedLimit,
        totalCount,
        totalPages: Math.max(1, Math.ceil(totalCount / normalizedLimit))
      }
    };
  }

  async getById(userId: string, letterId: string): Promise<LetterResponseDto> {
    const letter = await this.prisma.letter.findUnique({ where: { id: letterId } });
    if (!letter) {
      throw new NotFoundException('편지를 찾을 수 없습니다.');
    }

    await this.authz.assertCanReadByVisibility(userId, letter.babyId, letter.visibility);
    return this.toResponse(letter.id);
  }

  private async toResponse(letterId: string): Promise<LetterResponseDto> {
    const letter = await this.prisma.letter.findUnique({
      where: { id: letterId },
      include: { author: true }
    });

    if (!letter) {
      throw new NotFoundException('편지를 찾을 수 없습니다.');
    }

    return {
      id: letter.id,
      babyId: letter.babyId,
      authorId: letter.authorId,
      authorName: letter.author.name,
      title: letter.title,
      content: letter.content,
      visibility: toSharedVisibility(letter.visibility),
      createdAt: letter.createdAt.toISOString(),
      updatedAt: letter.updatedAt.toISOString()
    };
  }
}
