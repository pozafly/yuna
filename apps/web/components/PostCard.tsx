'use client';

/**
 * 게시물 카드 컴포넌트 (S-FEED-01에서 사용)
 *
 * 디자인 가이드:
 * - Pure Light 배경 + 큰 둥근 모서리 (4xl)
 * - 이미지가 있을 경우 상단에 이미지 프리뷰 표시
 * - 작성자, 날짜, 공개 범위, 댓글 수 표시
 * - 호버 시 부드러운 스케일 애니메이션
 */

import Link from 'next/link';
import Image from 'next/image';
import type { PostResponseDto } from '@yuna/shared-types';
import { Visibility } from '@yuna/shared-types';

interface PostCardProps {
  post: PostResponseDto;
}

// 날짜를 상대적인 시간으로 표시 (예: "방금 전", "3시간 전")
function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  if (diffDay < 7) return `${diffDay}일 전`;

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PostCard({ post }: PostCardProps) {
  const hasImages = post.mediaUrls.length > 0;
  const isPrivate = post.visibility === Visibility.PRIVATE;

  return (
    <Link
      href={`/feed/${post.id}`}
      className="block bg-pure-light rounded-4xl overflow-hidden shadow-sm
        transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
    >
      {/* 이미지 프리뷰 (있을 경우) */}
      {hasImages && (
        <div className="relative aspect-[4/3] bg-soft-dawn overflow-hidden">
          <Image
            src={post.mediaUrls[0]}
            alt={`${post.authorName}의 게시물 이미지`}
            fill
            className="object-cover transition-transform duration-300 hover:scale-[1.02]"
            sizes="(max-width: 630px) 100vw, 630px"
          />
          {/* 여러 장 표시 배지 */}
          {post.mediaUrls.length > 1 && (
            <div className="absolute top-3 right-3 bg-inkroot/60 text-pure-light text-xs font-semibold px-2.5 py-1 rounded-full">
              +{post.mediaUrls.length - 1}
            </div>
          )}
        </div>
      )}

      {/* 카드 바디 */}
      <div className="p-4">
        {/* 작성자 정보 및 메타데이터 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* 작성자 아바타 (이름 이니셜) */}
            <div
              className="w-8 h-8 rounded-full bg-petal-bloom flex items-center justify-center
                text-inkroot font-bold text-sm flex-shrink-0"
              aria-hidden="true"
            >
              {post.authorName.slice(0, 1)}
            </div>
            <div>
              <p className="text-sm font-semibold text-inkroot leading-tight">
                {post.authorName}
              </p>
              <p className="text-xs text-inkroot/50 leading-tight">
                {formatRelativeTime(post.createdAt)}
              </p>
            </div>
          </div>

          {/* 공개 범위 배지 */}
          <span
            className={[
              'text-xs font-semibold px-2.5 py-1 rounded-full',
              isPrivate
                ? 'bg-soft-dawn text-inkroot/60'
                : 'bg-sky-whisper text-inkroot',
            ].join(' ')}
            aria-label={isPrivate ? '나만 보기' : '가족 공개'}
          >
            {isPrivate ? '나만' : '가족'}
          </span>
        </div>

        {/* 게시물 내용 */}
        {post.content && (
          <p className="text-sm text-inkroot/80 leading-relaxed line-clamp-3 mb-3">
            {post.content}
          </p>
        )}

        {/* 촬영 날짜 (takenAt이 있을 경우) */}
        {post.takenAt && (
          <p className="text-xs text-inkroot/40 mb-2">
            📷{' '}
            {new Date(post.takenAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        {/* 댓글 수 */}
        {post.commentCount > 0 && (
          <div className="flex items-center gap-1 text-inkroot/50">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-xs">{post.commentCount}개의 댓글</span>
          </div>
        )}
      </div>
    </Link>
  );
}
