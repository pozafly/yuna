import { Visibility } from '../enums';

/** FE → BE: 편지 생성 요청 */
export interface CreateLetterDto {
    babyId: string;
    title: string;
    content: string;
    visibility: Visibility;
}

/** FE → BE: 편지 수정 요청 */
export interface UpdateLetterDto {
    title?: string;
    content?: string;
    visibility?: Visibility;
}

/** BE → FE: 편지 응답 */
export interface LetterResponseDto {
    id: string;
    babyId: string;
    authorId: string;
    authorName: string;
    title: string;
    content: string;
    visibility: Visibility;
    commentCount: number;
    createdAt: string;
    updatedAt: string;
}
