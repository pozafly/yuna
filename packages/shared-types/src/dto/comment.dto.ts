import { CommentTargetType } from '../enums';

/** FE → BE: 댓글 생성 요청 */
export interface CreateCommentDto {
    targetType: CommentTargetType;
    targetId: string;
    content: string;
}

/** FE → BE: 댓글 수정 요청 */
export interface UpdateCommentDto {
    content: string;
}

/** BE → FE: 댓글 응답 */
export interface CommentResponseDto {
    id: string;
    targetType: CommentTargetType;
    targetId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}
