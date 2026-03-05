'use client';

/**
 * 댓글 바텀시트 컴포넌트
 *
 * 디자인 가이드:
 * - 아래에서 위로 슬라이드 애니메이션 (300ms ease-in-out)
 * - 닫힐 때 역방향 애니메이션 후 unmount
 * - 배경 dim 클릭 시 닫힘
 * - max-h-[85vh], Pure Light 배경, 큰 둥근 상단 모서리
 * - 드래그 핸들 바 + 헤더 + 댓글 목록 + 하단 고정 입력창
 */

import { useState, useEffect, useCallback } from 'react';
import type { CommentResponseDto } from '@yuna/shared-types';
import { TargetType } from '@yuna/shared-types';
import { api } from '../lib/api';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface CommentBottomSheetProps {
  /** null이면 바텀시트가 닫힘, string이면 해당 postId로 열림 */
  postId: string | null;
  commentCount: number;
  onClose: () => void;
  onCommentAdded: (postId: string) => void;
}

export default function CommentBottomSheet({
  postId,
  commentCount,
  onClose,
  onCommentAdded,
}: CommentBottomSheetProps) {
  // 애니메이션 상태: true면 슬라이드 인, false면 슬라이드 아웃
  const [isVisible, setIsVisible] = useState(false);
  // 실제 DOM에서 unmount 여부 제어
  const [isMounted, setIsMounted] = useState(false);
  // 댓글 목록 상태
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // postId가 들어오면 mount → 다음 틱에 isVisible=true (슬라이드 인)
  useEffect(() => {
    if (postId !== null) {
      setIsMounted(true);
      // DOM에 렌더 후 애니메이션 시작
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
    } else {
      // 닫힘: 슬라이드 아웃 → 애니메이션 완료 후 unmount
      setIsVisible(false);
    }
  }, [postId]);

  // 슬라이드 아웃 완료 후 unmount 처리
  const handleTransitionEnd = useCallback(() => {
    if (!isVisible) {
      setIsMounted(false);
      setComments([]);
    }
  }, [isVisible]);

  // 댓글 목록 fetch
  useEffect(() => {
    if (!postId) return;

    setIsLoading(true);
    setComments([]);

    api
      .get<{ data: CommentResponseDto[] }>(`/posts/${postId}/comments`)
      .then((res) => {
        setComments(res.data);
      })
      .catch(() => {
        // fetch 실패 시 빈 목록 유지
        setComments([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [postId]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isMounted) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isMounted, onClose]);

  // 바텀시트 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isMounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMounted]);

  // 댓글 추가 콜백 (CommentForm에서 호출)
  const handleCommentAdded = useCallback(
    (comment: CommentResponseDto) => {
      setComments((prev) => [...prev, comment]);
      if (postId) {
        onCommentAdded(postId);
      }
    },
    [postId, onCommentAdded],
  );

  if (!isMounted) return null;

  return (
    <>
      {/* 배경 dim */}
      <div
        className={`fixed inset-0 z-40 bg-inkroot/40 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* 바텀시트 */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`댓글 ${commentCount}개`}
        className={`
          fixed bottom-0 left-0 right-0 z-50
          flex flex-col
          max-h-[85vh]
          bg-pure-light
          rounded-t-[2rem]
          shadow-[0_-4px_32px_rgba(0,0,0,0.12)]
          transition-transform duration-300 ease-in-out
          ${isVisible ? 'translate-y-0' : 'translate-y-full'}
        `}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* 드래그 핸들 바 */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 rounded-full bg-inkroot/20" />
        </div>

        {/* 헤더: 댓글 수 + 닫기 버튼 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-inkroot/5 flex-shrink-0">
          <h2 className="font-display text-base font-bold text-inkroot">
            댓글{' '}
            <span className="font-sans text-inkroot/60 text-sm font-normal">
              {commentCount +
                comments.filter(
                  (c) =>
                    !comments.some((existing) => existing.id === c.id && false),
                ).length >
              0
                ? commentCount
                : commentCount}
              개
            </span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center
              text-inkroot/50 hover:text-inkroot hover:bg-soft-dawn
              transition-all duration-150 active:scale-90"
            aria-label="댓글 닫기"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* 댓글 목록 영역 (스크롤 가능) */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          {isLoading ? (
            // 로딩 스켈레톤
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-soft-dawn flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-soft-dawn rounded-full w-24" />
                    <div className="h-3 bg-soft-dawn rounded-full w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <CommentList comments={comments} />
          )}
        </div>

        {/* 하단 고정: 댓글 입력창 */}
        {postId && (
          <div className="flex-shrink-0 pb-safe">
            <CommentForm
              targetType={TargetType.POST}
              targetId={postId}
              onCommentAdded={handleCommentAdded}
            />
          </div>
        )}
      </div>
    </>
  );
}
