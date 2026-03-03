import { Visibility } from '../enums';
export interface CreatePostDto {
    babyId: string;
    content: string;
    visibility: Visibility;
    takenAt?: string;
    mediaKeys?: string[];
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
    createdAt: string;
    updatedAt: string;
}
//# sourceMappingURL=post.dto.d.ts.map