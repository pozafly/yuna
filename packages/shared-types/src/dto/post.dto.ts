import { Visibility } from '../enums';

/** FE → BE: 게시물 생성 요청 */
export interface CreatePostDto {
    babyId: string;
    content: string;
    visibility: Visibility;
    takenAt?: string; // ISO 8601 (사진 촬영 날짜)
}

/** FE → BE: 게시물 수정 요청 */
export interface UpdatePostDto {
    content?: string;
    visibility?: Visibility;
    takenAt?: string;
}

/** BE → FE: 게시물 응답 (presigned URL 포함) */
export interface PostResponseDto {
    id: string;
    babyId: string;
    authorId: string;
    authorName: string;
    content: string;
    visibility: Visibility;
    takenAt: string | null;
    mediaUrls: string[]; // presigned URLs (만료 시간 포함)
    commentCount: number;
    createdAt: string;
    updatedAt: string;
}
