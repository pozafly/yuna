import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letter, BabyMembership } from '../common/entities';

@Injectable()
export class LetterService {
    constructor(
        @InjectRepository(Letter)
        private readonly letterRepo: Repository<Letter>,
        @InjectRepository(BabyMembership)
        private readonly membershipRepo: Repository<BabyMembership>,
    ) { }

    /** 편지 생성 — 모든 멤버(OWNER, INVITED) 가능 */
    async create(userId: string, data: { babyId: string; title: string; content: string; visibility: string }): Promise<Letter> {
        const membership = await this.membershipRepo.findOne({
            where: { babyId: data.babyId, userId, status: 'ACTIVE' },
        });
        if (!membership) throw new ForbiddenException('Baby 구성원만 편지를 작성할 수 있습니다.');

        const letter = this.letterRepo.create({
            babyId: data.babyId,
            authorId: userId,
            title: data.title,
            content: data.content,
            visibility: data.visibility || 'INVITED',
        });

        return this.letterRepo.save(letter);
    }

    /** 편지 목록 조회 — 권한(Visibility) 필터 적용 */
    async findAll(babyId: string, userId: string, page: number = 1, limit: number = 20) {
        const membership = await this.membershipRepo.findOne({
            where: { babyId, userId, status: 'ACTIVE' },
        });
        if (!membership) throw new ForbiddenException('접근 권한이 없습니다.');

        const query = this.letterRepo.createQueryBuilder('letter')
            .where('letter.babyId = :babyId', { babyId })
            .leftJoinAndSelect('letter.author', 'author')
            .orderBy('letter.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);

        if (membership.role === 'INVITED') {
            query.andWhere('letter.visibility = :visibility', { visibility: 'INVITED' });
        }

        const [letters, total] = await query.getManyAndCount();
        return { letters, total };
    }

    /** 편지 상세 조회 */
    async findOne(id: string, userId: string): Promise<Letter> {
        const letter = await this.letterRepo.findOne({
            where: { id },
            relations: ['author'],
        });
        if (!letter) throw new NotFoundException('편지를 찾을 수 없습니다.');

        const membership = await this.membershipRepo.findOne({
            where: { babyId: letter.babyId, userId, status: 'ACTIVE' },
        });

        if (!membership || (membership.role === 'INVITED' && letter.visibility === 'PRIVATE')) {
            throw new ForbiddenException('이 편지를 볼 수 있는 권한이 없습니다.');
        }

        return letter;
    }
}
