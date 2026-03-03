import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Baby, BabyMembership } from '../entities';
import {
  BabyStatus,
  Role,
  MembershipStatus,
} from '@yuna/shared-types';
import type { CreateBabyDto, UpdateBabyDto } from '@yuna/shared-types';

@Injectable()
export class BabyService {
  constructor(
    @InjectRepository(Baby)
    private readonly babyRepo: Repository<Baby>,
    @InjectRepository(BabyMembership)
    private readonly membershipRepo: Repository<BabyMembership>,
  ) {}

  /** Baby 생성 + OWNER 멤버십 자동 생성 */
  async create(userId: string, dto: CreateBabyDto) {
    const baby = this.babyRepo.create({
      name: dto.name,
      gender: dto.gender ?? null,
      birthDate: dto.birthDate ?? null,
    });
    await this.babyRepo.save(baby);

    const membership = this.membershipRepo.create({
      babyId: baby.id,
      userId,
      role: Role.OWNER,
      status: MembershipStatus.ACTIVE,
    });
    await this.membershipRepo.save(membership);

    return baby;
  }

  /** 내 Baby 목록 */
  async findMyBabies(userId: string) {
    const memberships = await this.membershipRepo.find({
      where: { userId, status: MembershipStatus.ACTIVE },
      relations: ['baby'],
    });

    return memberships
      .filter((m) => m.baby.status === BabyStatus.ACTIVE)
      .map((m) => ({
        ...this.toBabyResponse(m.baby),
        role: m.role,
      }));
  }

  /** Baby 상세 */
  async findOne(babyId: string) {
    const baby = await this.babyRepo.findOne({ where: { id: babyId } });
    if (!baby || baby.status !== BabyStatus.ACTIVE) {
      throw new NotFoundException('Baby를 찾을 수 없습니다');
    }
    return this.toBabyResponse(baby);
  }

  /** Baby 수정 (OWNER만) */
  async update(babyId: string, userId: string, dto: UpdateBabyDto) {
    await this.ensureOwner(babyId, userId);

    const baby = await this.babyRepo.findOne({ where: { id: babyId } });
    if (!baby) throw new NotFoundException();

    if (dto.name) baby.name = dto.name;
    if (dto.gender !== undefined) baby.gender = dto.gender ?? null;
    if (dto.birthDate !== undefined) baby.birthDate = dto.birthDate ?? null;

    await this.babyRepo.save(baby);
    return this.toBabyResponse(baby);
  }

  /** Baby 삭제 (OWNER만, soft delete) */
  async remove(babyId: string, userId: string) {
    await this.ensureOwner(babyId, userId);

    const baby = await this.babyRepo.findOne({ where: { id: babyId } });
    if (!baby) throw new NotFoundException();

    baby.status = BabyStatus.DELETED;
    baby.deletedAt = new Date();
    baby.downloadExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000,
    );
    await this.babyRepo.save(baby);

    return { message: 'Baby가 삭제되었습니다 (30일간 데이터 다운로드 가능)' };
  }

  /** Baby 멤버 목록 */
  async getMembers(babyId: string) {
    const memberships = await this.membershipRepo.find({
      where: { babyId, status: MembershipStatus.ACTIVE },
      relations: ['user'],
    });

    return memberships.map((m) => ({
      id: m.id,
      userId: m.user.id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      joinedAt: m.joinedAt.toISOString(),
    }));
  }

  private async ensureOwner(babyId: string, userId: string) {
    const membership = await this.membershipRepo.findOne({
      where: {
        babyId,
        userId,
        role: Role.OWNER,
        status: MembershipStatus.ACTIVE,
      },
    });
    if (!membership) {
      throw new ForbiddenException('OWNER 권한이 필요합니다');
    }
  }

  private toBabyResponse(baby: Baby) {
    return {
      id: baby.id,
      name: baby.name,
      gender: baby.gender,
      birthDate: baby.birthDate,
      status: baby.status,
      createdAt: baby.createdAt.toISOString(),
    };
  }
}
