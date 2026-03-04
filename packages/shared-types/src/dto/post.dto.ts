import { Visibility } from '../enums';

export interface CreatePostDto {
  babyId: string;
  content: string;
  visibility: Visibility;
  takenAt?: string; // ISO 8601
  mediaKeys?: string[]; // 업로드 완료된 storageKey 목록
}

export interface UpdatePostDto {
  content?: string;
  visibility?: Visibility;
  takenAt?: string;
}

export interface PostResponseDto {
  id: string;
  babyId: string;
  authorId: string;
  authorName: string;
  content: string;
  visibility: Visibility;
  takenAt: string | null;
  mediaUrls: string[];
  commentCount: number;
  likeCount: number;
  isLikedByMe: boolean;
  createdAt: string;
  updatedAt: string;
}
