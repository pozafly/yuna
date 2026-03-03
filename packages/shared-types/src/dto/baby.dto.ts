import { BabyStatus } from '../enums';

export interface CreateBabyDto {
  name: string;
  gender?: string;
  birthDate?: string; // ISO 8601
}

export interface UpdateBabyDto {
  name?: string;
  gender?: string;
  birthDate?: string;
}

export interface BabyResponseDto {
  id: string;
  name: string;
  gender: string | null;
  birthDate: string | null;
  status: BabyStatus;
  createdAt: string;
}
