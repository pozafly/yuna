import { BabyStatus, Role } from '../enums';

export interface CreateBabyDto {
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthDate?: string;
}

export interface BabyResponseDto {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  birthDate: string | null;
  status: BabyStatus;
  createdAt: string;
  role: Role;
}
