'use client';

/**
 * 댓글 미리보기 훅 (IntersectionObserver 기반 지연 fetch)
 *
 * - 카드가 viewport에 진입했을 때만 댓글을 fetch한다.
 * - commentCount가 0이면 fetch하지 않는다.
 * - 한 번 fetch 후에는 재요청하지 않는다.
 * - fetch 실패 시 조용히 무시하고 빈 배열을 반환한다.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { CommentResponseDto } from '@yuna/shared-types';
import { api } from '../lib/api';

interface UseCommentPreviewResult {
  previewComments: CommentResponseDto[];
  isLoading: boolean;
  cardRef: React.RefObject<HTMLElement>;
}

export function useCommentPreview(
  postId: string,
  commentCount: number,
): UseCommentPreviewResult {
  const [previewComments, setPreviewComments] = useState<CommentResponseDto[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(false);
  // 카드 요소를 관찰할 ref (HTMLElement로 선언해 article에도 적용 가능)
  const cardRef = useRef<HTMLElement>(null);
  // 이미 fetch 했는지 여부 추적 (중복 요청 방지)
  const hasFetched = useRef(false);

  const fetchComments = useCallback(async () => {
    // commentCount가 0이거나 이미 fetch 했다면 건너뜀
    if (commentCount === 0 || hasFetched.current) return;

    hasFetched.current = true;
    setIsLoading(true);

    try {
      const res = await api.get<{ data: CommentResponseDto[] }>(
        `/posts/${postId}/comments`,
      );
      // 최신 2개만 슬라이스 (BE는 최신순 정렬이므로 앞에서 2개)
      setPreviewComments(res.data.slice(0, 2));
    } catch {
      // fetch 실패 시 조용히 무시: previewComments는 빈 배열 유지
      setPreviewComments([]);
    } finally {
      setIsLoading(false);
    }
  }, [postId, commentCount]);

  useEffect(() => {
    // commentCount가 0이면 observer 자체를 등록하지 않음
    if (commentCount === 0) return;

    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchComments();
          // viewport 진입 후에는 observer를 해제해 불필요한 콜백 방지
          observer.disconnect();
        }
      },
      {
        // 화면에 가까워지기 시작할 때 미리 fetch
        rootMargin: '100px',
      },
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [commentCount, fetchComments]);

  return { previewComments, isLoading, cardRef };
}
