import { Visibility } from '../enums';

export interface CreateLetterDto {
  babyId: string;
  title: string;
  content: string;
  visibility: Visibility;
}

export interface LetterResponseDto {
  id: string;
  babyId: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
}
