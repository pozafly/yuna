import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { Post, PostMedia, BabyMembership } from '../common/entities';
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
        private readonly storageService: StorageService,
    ) { }

    /** 게시물 생성 준비: 권한 확인 후 presigned PUT URL 반환 */
    async requestUpload(userId: string, data: { babyId: string; fileCount: number; content: string; visibility: string; takenAt?: string }) {
        // OWNER 확인
        const membership = await this.membershipRepo.findOne({
            where: { babyId: data.babyId, userId, role: 'OWNER', status: 'ACTIVE' },
        });
        if (!membership) throw new ForbiddenException('OWNER만 게시물을 작성할 수 있습니다.');

        if (data.fileCount > 10) throw new BadRequestException('사진은 최대 10장까지 업로드할 수 있습니다.');

        // DB에 임시(또는 실제) Post 먼저 생성
        const post = this.postRepo.create({
            babyId: data.babyId,
            authorId: userId,
            content: data.content,
            visibility: data.visibility || 'INVITED',
            takenAt: data.takenAt ? new Date(data.takenAt) : new Date(),
        });
        const savedPost = await this.postRepo.save(post);

        // MinIO presigned URL 생성
        const uploads = await Promise.all(
            Array.from({ length: data.fileCount }).map(async (_, index) => {
                const fileId = uuid();
                const ext = 'jpg'; // 클라이언트에서 확장자를 받거나 jpg 고정 가정
                // TECH-D 명세: originals/{babyId}/{postId}/{uuid}.{ext}
                const storageKey = `originals/${data.babyId}/${savedPost.id}/${fileId}.${ext}`;
                const presignedUrl = await this.storageService.getPresignedPutUrl(storageKey);

                return { storageKey, presignedUrl, order: index };
            })
        );

        return { postId: savedPost.id, uploads };
    }

    /** 업로드 완료 확인 후 Media 레코드 생성 */
    async confirmUpload(userId: string, postId: string, mediaData: { storageKey: string; order: number }[]) {
        const post = await this.postRepo.findOne({ where: { id: postId, authorId: userId } });
        if (!post) throw new NotFoundException('게시물을 찾을 수 없습니다.');

        const mediaList = mediaData.map(data =>
            this.mediaRepo.create({
                postId,
                storageKey: data.storageKey,
                order: data.order,
            })
        );

        await this.mediaRepo.save(mediaList);
        return post;
    }

    /** 피드 조회 — 권한(Visibility)에 따라 필터링 */
    async getFeed(babyId: string, userId: string, page: number = 1, limit: number = 20) {
        const membership = await this.membershipRepo.findOne({
            where: { babyId, userId, status: 'ACTIVE' },
        });

        if (!membership) throw new ForbiddenException('접근 권한이 없습니다.');

        const query = this.postRepo.createQueryBuilder('post')
            .where('post.babyId = :babyId', { babyId })
            .leftJoinAndSelect('post.author', 'author')
            .leftJoinAndSelect('post.media', 'media')
            .orderBy('post.takenAt', 'DESC')
            .addOrderBy('post.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        // INVITED 권한이면 visibility가 INVITED인 것만 볼 수 있음
        if (membership.role === 'INVITED') {
            query.andWhere('post.visibility = :visibility', { visibility: 'INVITED' });
        }

        const [posts, total] = await query.getManyAndCount();

        // storageKey를 presigned GET URL로 변환
        const mappedPosts = await Promise.all(
            posts.map(async (post) => {
                post.media.sort((a, b) => a.order - b.order);
                const mediaUrls = await Promise.all(
                    post.media.map(m => this.storageService.getPresignedGetUrl(m.storageKey))
                );
                return {
                    id: post.id,
                    babyId: post.babyId,
                    authorName: post.author.name,
                    content: post.content,
                    visibility: post.visibility,
                    takenAt: post.takenAt,
                    mediaUrls,
                    createdAt: post.createdAt,
                };
            })
        );

        return { posts: mappedPosts, total };
    }
}
