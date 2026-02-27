import { BabyStatus } from '../enums';

/** FE → BE: Baby 생성 요청 */
export interface CreateBabyDto {
    name: string;
    gender: string;
    birthDate: string; // ISO 8601
}

/** FE → BE: Baby 수정 요청 */
export interface UpdateBabyDto {
    name?: string;
    gender?: string;
    birthDate?: string;
}

/** BE → FE: Baby 응답 */
export interface BabyResponseDto {
    id: string;
    name: string;
    gender: string;
    birthDate: string;
    status: BabyStatus;
    createdAt: string;
}
