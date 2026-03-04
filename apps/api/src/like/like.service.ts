import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, Post, BabyMembership } from '../entities';
import {
  Role,
  MembershipStatus,
  Visibility,
} from '@yuna/shared-types';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepo: Repository<Like>,
    @InjectRepository(Post)
    private readonly postRepo: Repository<Post>,
    @InjectRepository(BabyMembership)
    private readonly membershipRepo: Repository<BabyMembership>,
  ) {}

  /** 좋아요 토글 — 있으면 삭제, 없으면 생성 */
  async toggle(userId: string, babyId: string, postId: string) {
    const post = await this.postRepo.findOne({ where: { id: postId } });
    if (!post || post.babyId !== babyId) {
      throw new NotFoundException('게시물을 찾을 수 없습니다');
    }

    // 멤버십 + visibility 권한 체크
    const membership = await this.membershipRepo.findOne({
      where: { babyId, userId, status: MembershipStatus.ACTIVE },
    });
    if (!membership) throw new ForbiddenException();
    if (
      post.visibility === Visibility.PRIVATE &&
      membership.role !== Role.OWNER
    ) {
      throw new ForbiddenException('접근 권한이 없습니다');
    }

    const existing = await this.likeRepo.findOne({
      where: { userId, postId },
    });

    if (existing) {
      await this.likeRepo.remove(existing);
    } else {
      const like = this.likeRepo.create({ userId, postId });
      await this.likeRepo.save(like);
    }

    const likeCount = await this.likeRepo.count({ where: { postId } });
    return { liked: !existing, likeCount };
  }
}
