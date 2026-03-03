import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Letter, BabyMembership } from '../entities';
import {
  Role,
  MembershipStatus,
  Visibility,
} from '@yuna/shared-types';
import type { CreateLetterDto, UpdateLetterDto } from '@yuna/shared-types';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(Letter)
    private readonly letterRepo: Repository<Letter>,
    @InjectRepository(BabyMembership)
    private readonly membershipRepo: Repository<BabyMembership>,
  ) {}

  /** 편지 작성 (OWNER + INVITED 모두 가능) */
  async create(userId: string, dto: CreateLetterDto) {
    const membership = await this.membershipRepo.findOne({
      where: {
        babyId: dto.babyId,
        userId,
        status: MembershipStatus.ACTIVE,
      },
    });
    if (!membership) throw new ForbiddenException();

    const letter = this.letterRepo.create({
      babyId: dto.babyId,
      authorId: userId,
      title: dto.title,
      content: dto.content,
      visibility: dto.visibility,
    });
    await this.letterRepo.save(letter);
    return this.findOne(letter.id, userId);
  }

  /** Baby 편지 목록 */
  async findByBaby(babyId: string, userId: string, page = 1, limit = 20) {
    const membership = await this.membershipRepo.findOne({
      where: { babyId, userId, status: MembershipStatus.ACTIVE },
    });
    if (!membership) throw new ForbiddenException();

    const qb = this.letterRepo
      .createQueryBuilder('letter')
      .leftJoinAndSelect('letter.author', 'author')
      .where('letter.babyId = :babyId', { babyId });

    if (membership.role === Role.INVITED) {
      qb.andWhere('letter.visibility = :vis', { vis: Visibility.INVITED });
    }

    const [letters, totalCount] = await qb
      .orderBy('letter.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data: letters.map((l) => this.toResponse(l)),
      pagination: { page, limit, totalCount, totalPages: Math.ceil(totalCount / limit) },
    };
  }

  /** 편지 상세 */
  async findOne(letterId: string, userId: string) {
    const letter = await this.letterRepo.findOne({
      where: { id: letterId },
      relations: ['author'],
    });
    if (!letter) throw new NotFoundException();

    const membership = await this.membershipRepo.findOne({
      where: { babyId: letter.babyId, userId, status: MembershipStatus.ACTIVE },
    });
    if (!membership) throw new ForbiddenException();
    if (letter.visibility === Visibility.PRIVATE && membership.role !== Role.OWNER) {
      throw new ForbiddenException();
    }

    return this.toResponse(letter);
  }

  /** 편지 수정 (작성자만) */
  async update(letterId: string, userId: string, dto: UpdateLetterDto) {
    const letter = await this.letterRepo.findOne({ where: { id: letterId } });
    if (!letter) throw new NotFoundException();
    if (letter.authorId !== userId) throw new ForbiddenException('작성자만 수정 가능');

    if (dto.title !== undefined) letter.title = dto.title;
    if (dto.content !== undefined) letter.content = dto.content;
    if (dto.visibility !== undefined) letter.visibility = dto.visibility;

    await this.letterRepo.save(letter);
    return this.findOne(letter.id, userId);
  }

  /** 편지 삭제 (작성자만) */
  async remove(letterId: string, userId: string) {
    const letter = await this.letterRepo.findOne({ where: { id: letterId } });
    if (!letter) throw new NotFoundException();
    if (letter.authorId !== userId) throw new ForbiddenException('작성자만 삭제 가능');
    await this.letterRepo.remove(letter);
    return { message: '편지가 삭제되었습니다' };
  }

  private toResponse(letter: Letter) {
    return {
      id: letter.id,
      babyId: letter.babyId,
      authorId: letter.authorId,
      authorName: letter.author?.name ?? '',
      title: letter.title,
      content: letter.content,
      visibility: letter.visibility,
      commentCount: 0,
      createdAt: letter.createdAt.toISOString(),
      updatedAt: letter.updatedAt.toISOString(),
    };
  }
}
