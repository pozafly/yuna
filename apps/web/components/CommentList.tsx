'use client';

/**
 * 댓글 목록 컴포넌트
 *
 * 댓글 목록을 표시하고, 차단된 사용자의 댓글은
 * "차단된 사용자의 댓글입니다."로 대체 표시한다.
 */

import type { CommentResponseDto } from '@yuna/shared-types';

interface CommentListProps {
  comments: CommentResponseDto[];
  blockedAuthorIds?: string[];
}

// 댓글 날짜 포맷 (짧은 형식)
function formatCommentDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 1000 / 60);
  const diffHour = Math.floor(diffMin / 60);

  if (diffMin < 1) return '방금';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;

  return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
}

export default function CommentList({
  comments,
  blockedAuthorIds = [],
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-inkroot/40 text-sm font-handwrite text-lg">
          아직 댓글이 없어요
        </p>
        <p className="text-inkroot/30 text-xs mt-1">첫 댓글을 남겨보세요!</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3" aria-label="댓글 목록">
      {comments.map((comment) => {
        const isBlocked = blockedAuthorIds.includes(comment.authorId);

        return (
          <li
            key={comment.id}
            className="flex gap-3 animate-fade-in"
          >
            {/* 작성자 아바타 */}
            <div
              className={[
                'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center',
                'text-inkroot font-bold text-sm',
                isBlocked ? 'bg-inkroot/10' : 'bg-sky-whisper',
              ].join(' ')}
              aria-hidden="true"
            >
              {isBlocked ? '?' : comment.authorName.slice(0, 1)}
            </div>

            {/* 댓글 내용 */}
            <div className="flex-1 min-w-0">
              <div className="bg-soft-dawn rounded-3xl rounded-tl-none px-4 py-2.5">
                {/* 작성자 이름 */}
                <p className="text-xs font-semibold text-inkroot mb-1">
                  {isBlocked ? '차단된 사용자' : comment.authorName}
                </p>

                {/* 댓글 본문 */}
                <p
                  className={[
                    'text-sm leading-relaxed',
                    isBlocked ? 'text-inkroot/40 italic' : 'text-inkroot/80',
                  ].join(' ')}
                >
                  {isBlocked
                    ? '차단된 사용자의 댓글입니다.'
                    : comment.content}
                </p>
              </div>

              {/* 작성 시간 */}
              <p className="text-xs text-inkroot/40 mt-1 ml-2">
                {formatCommentDate(comment.createdAt)}
              </p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
