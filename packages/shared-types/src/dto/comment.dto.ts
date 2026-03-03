import { TargetType } from '../enums';

export interface CreateCommentDto {
  targetType: TargetType;
  targetId: string;
  content: string;
}

export interface CommentResponseDto {
  id: string;
  targetType: TargetType;
  targetId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
