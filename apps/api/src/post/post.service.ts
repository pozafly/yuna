import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post, PostMedia, BabyMembership, Like } from '../entities';
import {
  Role,
  MembershipStatus,
  Visibility,
} from '@yuna/shared-types';
import type { CreatePostDto, UpdatePostDto } from '@yuna/shared-types';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(PostMedia)
    private readonly mediaRepo: Repository<PostMedia>,
    @InjectRepository(BabyMembership)
    private readonly membershipRepo: Repository<BabyMembership>,
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    private readonly storageService: StorageService,
  ) {}

  /** 게시물 작성 (OWNER만) */
  async create(userId: string, dto: CreatePostDto) {
    const membership = await this.membershipRepo.findOne({
      where: {
        babyId: dto.babyId,
        userId,
        role: Role.OWNER,
        status: MembershipStatus.ACTIVE,
      },
    });
    if (!membership) {
      throw new ForbiddenException('OWNER만 게시물을 작성할 수 있습니다');
    }

    const post = this.postRepo.create({
      babyId: dto.babyId,
      authorId: userId,
      content: dto.content,
      visibility: dto.visibility,
      takenAt: dto.takenAt ? new Date(dto.takenAt) : null,
    });
    await this.postRepo.save(post);

    // 미디어 키가 있으면 PostMedia 생성
    if (dto.mediaKeys?.length) {
      const mediaEntities = dto.mediaKeys.map((key, index) =>
        this.mediaRepo.create({
          postId: post.id,
          storageKey: key,
          order: index,
        }),
      );
      await this.mediaRepo.save(mediaEntities);
    }

    return this.findOne(post.id, userId);
  }

  /** Baby 피드 조회 (pagination + visibility 필터) */
  async findByBaby(
    babyId: string,
    userId: string,
    page = 1,
    limit = 20,
  ) {
    const membership = await this.membershipRepo.findOne({
      where: { babyId, userId, status: MembershipStatus.ACTIVE },
    });
    if (!membership) throw new ForbiddenException();

    const qb = this.postRepo
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .leftJoinAndSelect('post.media', 'media')
      .where('post.babyId = :babyId', { babyId });

    // INVITED 역할이면 PRIVATE 게시물 제외
    if (membership.role === Role.INVITED) {
      qb.andWhere('post.visibility = :vis', { vis: Visibility.INVITED });
    }

    const [posts, totalCount] = await qb
      .orderBy('post.createdAt', 'DESC')
      .addOrderBy('media.order', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: await Promise.all(posts.map((p) => this.toResponse(p, userId))),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  /** 게시물 상세 */
  async findOne(postId: string, userId: string) {
    const post = await this.postRepo.findOne({
      where: { id: postId },
      relations: ['author', 'media'],
    });
    if (!post) throw new NotFoundException();

    // 멤버십 + visibility 체크
    const membership = await this.membershipRepo.findOne({
      where: { babyId: post.babyId, userId, status: MembershipStatus.ACTIVE },
    });
    if (!membership) throw new ForbiddenException();
    if (
      post.visibility === Visibility.PRIVATE &&
      membership.role !== Role.OWNER
    ) {
      throw new ForbiddenException('접근 권한이 없습니다');
    }

    return await this.toResponse(post, userId);
  }

  /** 게시물 수정 (작성자만) */
  async update(postId: string, userId: string, dto: UpdatePostDto) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();
    if (post.authorId !== userId) {
      throw new ForbiddenException('작성자만 수정할 수 있습니다');
    }

    if (dto.content !== undefined) post.content = dto.content;
    if (dto.visibility !== undefined) post.visibility = dto.visibility;
    if (dto.takenAt !== undefined) {
      post.takenAt = dto.takenAt ? new Date(dto.takenAt) : null;
    }

    await this.postRepo.save(post);
    return this.findOne(post.id, userId);
  }

  /** 게시물 삭제 (작성자만) */
  async remove(postId: string, userId: string) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post) throw new NotFoundException();
    if (post.authorId !== userId) {
      throw new ForbiddenException('작성자만 삭제할 수 있습니다');
    }
    await this.postRepo.remove(post);
    return { message: '게시물이 삭제되었습니다' };
  }

  private async toResponse(post: Post, userId: string) {
    const sortedMedia = (post.media ?? []).sort((a, b) => a.order - b.order);
    const [mediaUrls, likeCount, myLike] = await Promise.all([
      Promise.all(
        sortedMedia.map((m) =>
          this.storageService.generateGetUrl(m.storageKey),
        ),
      ),
      this.likeRepo.count({ where: { postId: post.id } }),
      this.likeRepo.findOne({ where: { postId: post.id, userId } }),
    ]);

    return {
      id: post.id,
      babyId: post.babyId,
      authorId: post.authorId,
      authorName: post.author?.name ?? '',
      content: post.content,
      visibility: post.visibility,
      takenAt: post.takenAt?.toISOString() ?? null,
      mediaUrls,
      commentCount: 0, // TODO: 실제 카운트 쿼리
      likeCount,
      isLikedByMe: !!myLike,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  }
}
