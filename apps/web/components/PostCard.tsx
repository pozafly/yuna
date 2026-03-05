'use client';

/**
 * 게시물 카드 컴포넌트 (S-FEED-01에서 사용)
 *
 * 디자인 가이드:
 * - Pure Light 배경 + 큰 둥근 모서리 (4xl)
 * - 이미지 캐러셀 (스와이프 + 화살표 + 도트)
 * - 좋아요 하트 버튼 (낙관적 업데이트)
 * - 인라인 댓글 미리보기 (IntersectionObserver 기반 지연 fetch)
 * - "댓글 N개 모두 보기" → 바텀시트 오픈
 * - 호버 시 부드러운 스케일 애니메이션
 */

import { useState, useCallback } from 'react';
import type { PostResponseDto } from '@yuna/shared-types';
import { Visibility } from '@yuna/shared-types';
import Doodle from './Doodle';
import ImageCarousel from './ImageCarousel';
import { api } from '../lib/api';
import { useCommentPreview } from '../hooks/useCommentPreview';

interface PostCardProps {
  post: PostResponseDto;
  onOpenComments: (postId: string) => void;
}

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

const placeholderStyles = [
  { bg: 'bg-petal-bloom', doodle: 'heart' as const, color: '#9B4CC4' },
  { bg: 'bg-sky-whisper', doodle: 'star' as const, color: '#5BA4D9' },
  { bg: 'bg-soft-dawn', doodle: 'sparkle' as const, color: '#8B7A00' },
  { bg: 'bg-petal-bloom', doodle: 'flower' as const, color: '#C44C8B' },
];

const avatarColors = [
  'bg-sky-whisper',
  'bg-petal-bloom',
  'bg-soft-dawn',
  'bg-sunbeam-pop',
  'bg-blush-berry/30',
];

export default function PostCard({ post, onOpenComments }: PostCardProps) {
  const hasImages = post.mediaUrls.length > 0;
  const isPrivate = post.visibility === Visibility.PRIVATE;

  // 좋아요 상태 (낙관적 업데이트)
  const [liked, setLiked] = useState(post.isLikedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [likeAnimating, setLikeAnimating] = useState(false);

  // 댓글 미리보기 (viewport 진입 시 fetch)
  const { previewComments, cardRef } = useCommentPreview(
    post.id,
    post.commentCount,
  );

  const styleIdx = post.id.charCodeAt(0) % placeholderStyles.length;
  const placeholder = placeholderStyles[styleIdx];
  const avatarColor =
    avatarColors[post.authorName.charCodeAt(0) % avatarColors.length];

  // 좋아요 토글
  const handleLike = useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();

      // 낙관적 업데이트
      const newLiked = !liked;
      setLiked(newLiked);
      setLikeCount((prev) => prev + (newLiked ? 1 : -1));

      if (newLiked) {
        setLikeAnimating(true);
        setTimeout(() => setLikeAnimating(false), 300);
      }

      try {
        const babyId = document.querySelector('main')?.dataset.babyId;
        if (babyId) {
          await api.post<{ data: { liked: boolean; likeCount: number } }>(
            `/babies/${babyId}/posts/${post.id}/likes`,
          );
        }
      } catch {
        // 실패 시 롤백
        setLiked(!newLiked);
        setLikeCount((prev) => prev + (newLiked ? -1 : 1));
      }
    },
    [liked, post.id],
  );

  // 댓글 아이콘 / "모두 보기" 클릭 → 바텀시트 오픈
  const handleOpenComments = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onOpenComments(post.id);
    },
    [post.id, onOpenComments],
  );

  return (
    // Link 제거 → article 태그로 교체 (인라인 캐러셀 + 댓글 바텀시트 사용)
    <article
      ref={cardRef as React.RefObject<HTMLElement>}
      className="bg-pure-light rounded-4xl overflow-hidden shadow-card
        transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1 active:scale-[0.99]"
    >
      {/* 이미지 캐러셀 */}
      {hasImages && (
        <ImageCarousel
          images={post.mediaUrls}
          alt={`${post.authorName}의 게시물 이미지`}
        />
      )}

      {/* 이미지 없을 때: placeholder */}
      {!hasImages && (
        <div
          className={`relative aspect-square ${placeholder.bg} flex items-center justify-center`}
        >
          <Doodle
            type={placeholder.doodle}
            size={48}
            color={placeholder.color}
            className="opacity-50"
          />
        </div>
      )}

      {/* 카드 바디 */}
      <div className="p-4">
        {/* 작성자 정보 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center
                text-inkroot font-bold text-sm flex-shrink-0 ${avatarColor}`}
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

        {/* 좋아요 + 댓글 액션 바 */}
        <div className="flex items-center gap-4 mb-3">
          {/* 좋아요 버튼 */}
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-1.5 group/like"
            aria-label={liked ? '좋아요 취소' : '좋아요'}
          >
            <svg
              className={`w-5 h-5 transition-all duration-200 ${
                liked
                  ? 'text-blush-berry fill-blush-berry'
                  : 'text-inkroot/40 fill-none group-hover/like:text-blush-berry/60'
              } ${likeAnimating ? 'scale-125' : 'scale-100'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {likeCount > 0 && (
              <span
                className={`text-xs font-medium ${liked ? 'text-blush-berry' : 'text-inkroot/40'}`}
              >
                {likeCount}
              </span>
            )}
          </button>

          {/* 댓글 아이콘 버튼 → 바텀시트 오픈 */}
          <button
            type="button"
            onClick={handleOpenComments}
            className="flex items-center gap-1.5 text-inkroot/40
              hover:text-inkroot/70 transition-colors duration-150"
            aria-label="댓글 보기"
          >
            <svg
              className="w-5 h-5"
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
            {post.commentCount > 0 && (
              <span className="text-xs font-medium">{post.commentCount}</span>
            )}
          </button>
        </div>

        {/* 게시물 내용 */}
        {post.content && (
          <p className="text-sm text-inkroot/80 leading-relaxed line-clamp-3 mb-2">
            {post.content}
          </p>
        )}

        {/* 촬영 날짜 */}
        {post.takenAt && (
          <p className="text-xs text-inkroot/40 mb-2 flex items-center gap-1">
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
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <circle cx="12" cy="13" r="3" />
            </svg>
            {new Date(post.takenAt).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        )}

        {/* 인라인 댓글 미리보기 */}
        {post.commentCount > 0 ? (
          <div className="space-y-1.5 mt-2">
            {/* 최신 댓글 2개 미리보기 */}
            {previewComments.map((comment) => (
              <p
                key={comment.id}
                className="text-xs text-inkroot/70 leading-snug line-clamp-1"
              >
                {/* compact 인라인: "작성자 · 내용" 1줄 말줄임 */}
                <span className="font-semibold text-inkroot/80 mr-1">
                  {comment.authorName}
                </span>
                <span className="text-inkroot/50">·</span>
                <span className="ml-1">{comment.content}</span>
              </p>
            ))}

            {/* "댓글 N개 모두 보기" 링크 */}
            <button
              type="button"
              onClick={handleOpenComments}
              className="text-xs text-inkroot/40 hover:text-inkroot/70
                transition-colors duration-150 text-left"
            >
              댓글 {post.commentCount}개 모두 보기
            </button>
          </div>
        ) : (
          /* 댓글이 없을 때 */
          <button
            type="button"
            onClick={handleOpenComments}
            className="text-xs text-inkroot/30 hover:text-inkroot/50
              transition-colors duration-150 mt-2 text-left"
          >
            첫 댓글을 남겨보세요
          </button>
        )}
      </div>
    </article>
  );
}
