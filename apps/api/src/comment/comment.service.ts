import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, Post, Letter, BabyMembership } from '../entities';
import {
  TargetType,
  Role,
  MembershipStatus,
  Visibility,
} from '@yuna/shared-types';
import type { CreateCommentDto } from '@yuna/shared-types';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(Letter)
    private readonly letterRepo: Repository<Letter>,
    @InjectRepository(BabyMembership)
    private readonly membershipRepo: Repository<BabyMembership>,
  ) {}

  /** 댓글 작성 (상위 콘텐츠 접근 권한 필요) */
  async create(userId: string, dto: CreateCommentDto) {
    const { babyId, visibility } = await this.getTargetInfo(
      dto.targetType,
      dto.targetId,
    );

    await this.checkAccess(babyId, userId, visibility);

    const comment = this.commentRepo.create({
      targetType: dto.targetType,
      targetId: dto.targetId,
      authorId: userId,
      content: dto.content,
    });
    await this.commentRepo.save(comment);

    return this.findOneById(comment.id);
  }

  /** 특정 대상의 댓글 목록 */
  async findByTarget(targetType: TargetType, targetId: string, userId: string) {
    const { babyId, visibility } = await this.getTargetInfo(
      targetType,
      targetId,
    );
    await this.checkAccess(babyId, userId, visibility);

    const comments = await this.commentRepo.find({
      where: { targetType, targetId },
      relations: ['author'],
      order: { createdAt: 'ASC' },
    });

    return comments.map((c) => this.toResponse(c));
  }

  /** 댓글 삭제 (작성자 본인만 — OWNER도 타인 댓글 삭제 불가) */
  async remove(commentId: string, userId: string) {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });
    if (!comment) throw new NotFoundException();
    if (comment.authorId !== userId) {
      throw new ForbiddenException('작성자 본인만 삭제할 수 있습니다');
    }
    await this.commentRepo.remove(comment);
    return { message: '댓글이 삭제되었습니다' };
  }

  private async findOneById(id: string) {
    const comment = await this.commentRepo.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!comment) throw new NotFoundException();
    return this.toResponse(comment);
  }

  /** 대상 콘텐츠의 babyId와 visibility 조회 */
  private async getTargetInfo(
    targetType: TargetType,
    targetId: string,
  ): Promise<{ babyId: string; visibility: Visibility }> {
    if (targetType === TargetType.POST) {
      const post = await this.postRepo.findOne({ where: { id: targetId } });
      if (!post) throw new NotFoundException('게시물을 찾을 수 없습니다');
      return { babyId: post.babyId, visibility: post.visibility };
    } else {
      const letter = await this.letterRepo.findOne({
        where: { id: targetId },
      });
      if (!letter) throw new NotFoundException('편지를 찾을 수 없습니다');
      return { babyId: letter.babyId, visibility: letter.visibility };
    }
  }

  /** 멤버십 + visibility 권한 체크 */
  private async checkAccess(
    babyId: string,
    userId: string,
    visibility: Visibility,
  ) {
    const membership = await this.membershipRepo.findOne({
      where: { babyId, userId, status: MembershipStatus.ACTIVE },
    });
    if (!membership) throw new ForbiddenException();
    if (
      visibility === Visibility.PRIVATE &&
      membership.role !== Role.OWNER
    ) {
      throw new ForbiddenException();
    }
  }

  private toResponse(comment: Comment) {
    return {
      id: comment.id,
      targetType: comment.targetType,
      targetId: comment.targetId,
      authorId: comment.authorId,
      authorName: comment.author?.name ?? '',
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      updatedAt: comment.updatedAt.toISOString(),
    };
  }
}
