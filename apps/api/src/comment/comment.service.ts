import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, Post, Letter, BabyMembership } from '../common/entities';

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
    ) { }

    /** 댓글 생성 — 대상(Post/Letter)의 권한을 상속받아 확인 */
    async create(userId: string, data: { targetType: string; targetId: string; content: string }): Promise<Comment> {
        let babyId: string;
        let targetVisibility: string;

        if (data.targetType === 'POST') {
            const post = await this.postRepo.findOne({ where: { id: data.targetId } });
            if (!post) throw new NotFoundException('게시물을 찾을 수 없습니다.');
            babyId = post.babyId;
            targetVisibility = post.visibility;
        } else if (data.targetType === 'LETTER') {
            const letter = await this.letterRepo.findOne({ where: { id: data.targetId } });
            if (!letter) throw new NotFoundException('편지를 찾을 수 없습니다.');
            babyId = letter.babyId;
            targetVisibility = letter.visibility;
        } else {
            throw new BadRequestException('잘못된 targetType입니다.');
        }

        const membership = await this.membershipRepo.findOne({
            where: { babyId, userId, status: 'ACTIVE' },
        });

        if (!membership || (membership.role === 'INVITED' && targetVisibility === 'PRIVATE')) {
            throw new ForbiddenException('이 콘텐츠에 댓글을 달 권한이 없습니다.');
        }

        const comment = this.commentRepo.create({
            targetType: data.targetType,
            targetId: data.targetId,
            authorId: userId,
            content: data.content,
        });

        return this.commentRepo.save(comment);
    }

    /** 해당 대상의 댓글 목록 조회 */
    async findAllByTarget(targetType: string, targetId: string, page: number = 1, limit: number = 50) {
        const [comments, total] = await this.commentRepo.findAndCount({
            where: { targetType, targetId },
            relations: ['author'],
            order: { createdAt: 'ASC' }, // 오래된 순
            skip: (page - 1) * limit,
            take: limit,
        });
        return { comments, total };
    }

    /** 댓글 삭제 (작성자 또는 OWNER 가능) */
    async remove(id: string, userId: string): Promise<void> {
        const comment = await this.commentRepo.findOne({ where: { id } });
        if (!comment) throw new NotFoundException('댓글을 찾을 수 없습니다.');

        // 작성자 본인인지 확인
        if (comment.authorId === userId) {
            await this.commentRepo.remove(comment);
            return;
        }

        // 작성자가 아니라면 Baby OWNER인지 확인해야 함
        let babyId: string | null = null;
        if (comment.targetType === 'POST') {
            const post = await this.postRepo.findOne({ where: { id: comment.targetId } });
            if (post) babyId = post.babyId;
        } else if (comment.targetType === 'LETTER') {
            const letter = await this.letterRepo.findOne({ where: { id: comment.targetId } });
            if (letter) babyId = letter.babyId;
        }

        if (!babyId) throw new NotFoundException('대상을 찾을 수 없습니다.');

        const membership = await this.membershipRepo.findOne({
            where: { babyId, userId, role: 'OWNER', status: 'ACTIVE' },
        });

        if (!membership) {
            throw new ForbiddenException('댓글은 작성자나 관리자(OWNER)만 삭제할 수 있습니다.');
        }

        await this.commentRepo.remove(comment);
    }
}
