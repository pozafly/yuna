import { CommentTargetType } from '../enums';

export interface CreateCommentDto {
  targetType: CommentTargetType;
  targetId: string;
  content: string;
}

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
