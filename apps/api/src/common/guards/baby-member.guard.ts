import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BabyMembership, Baby } from '../../entities';
import { MembershipStatus, BabyStatus } from '@yuna/shared-types';

/**
 * Baby 멤버십 검증 가드
 * babyId는 req.params.babyId 또는 req.body.babyId에서 추출
 */
@Injectable()
export class BabyMemberGuard implements CanActivate {
  constructor(
    @InjectRepository(BabyMembership)
    private readonly membershipRepo: Repository<BabyMembership>,
    @InjectRepository(Baby)
    private readonly babyRepo: Repository<Baby>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;
    const babyId = req.params.babyId || req.body?.babyId;

    if (!userId || !babyId) {
      throw new ForbiddenException('접근 권한이 없습니다');
    }

    // Baby 상태 확인
    const baby = await this.babyRepo.findOne({ where: { id: babyId } });
    if (!baby || baby.status !== BabyStatus.ACTIVE) {
      throw new ForbiddenException('존재하지 않거나 삭제된 Baby입니다');
    }

    // 멤버십 확인
    const membership = await this.membershipRepo.findOne({
      where: { babyId, userId, status: MembershipStatus.ACTIVE },
    });

    if (!membership) {
      throw new ForbiddenException('해당 Baby의 멤버가 아닙니다');
    }

    req.membership = membership;
    return true;
  }
}
