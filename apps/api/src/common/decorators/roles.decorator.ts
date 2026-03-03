import { SetMetadata } from '@nestjs/common';
import { Role } from '@yuna/shared-types';

/** 특정 Role만 접근을 허용할 때 사용하는 메타데이터 데코레이터 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
