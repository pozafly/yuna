'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import CommentList from '../../../../components/CommentList';
import CommentForm from '../../../../components/CommentForm';
import SectionLabel from '../../../../components/SectionLabel';
import BrandMark from '../../../../components/BrandMark';
import ImageCarousel from '../../../../components/ImageCarousel';
import { TargetType } from '@yuna/shared-types';
import type { PostResponseDto, CommentResponseDto } from '@yuna/shared-types';

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const router = useRouter();
  const [post, setPost] = useState<PostResponseDto | null>(null);
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!postId) return;

    Promise.all([
      api.get<{ data: PostResponseDto }>(`/posts/${postId}`),
      api.get<{ data: CommentResponseDto[] }>(`/posts/${postId}/comments`),
    ])
      .then(([postRes, commentsRes]) => {
        setPost(postRes.data);
        setComments(commentsRes.data);
      })
      .catch(() => router.push('/feed'))
      .finally(() => setLoading(false));
  }, [postId, router]);

  // 좋아요 상태
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeAnimating, setLikeAnimating] = useState(false);

  // post 로드 후 좋아요 상태 동기화
  useEffect(() => {
    if (post) {
      setLiked(post.isLikedByMe);
      setLikeCount(post.likeCount);
    }
  }, [post]);

  const handleLike = useCallback(async () => {
    if (!post) return;

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
        await api.post(`/babies/${babyId}/posts/${post.id}/likes`);
      }
    } catch {
      setLiked(!newLiked);
      setLikeCount((prev) => prev + (newLiked ? -1 : 1));
    }
  }, [liked, post]);

  const handleCommentAdded = (comment: CommentResponseDto) => {
    setComments((prev) => [...prev, comment]);
  };

  if (loading) {
    return (
      <div className="text-center py-16 animate-bounce-soft">
        <BrandMark size={32} color="#DDA9F3" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="animate-fade-in space-y-4">
      {/* 뒤로가기 */}
      <button
        onClick={() => router.back()}
        className="text-inkroot/50 text-sm hover:text-inkroot transition"
      >
        ← 피드로 돌아가기
      </button>

      {/* 게시물 콘텐츠 */}
      <article className="bg-pure-light rounded-4xl border border-inkroot/5 overflow-hidden">
        {/* 이미지 캐러셀 */}
        {post.mediaUrls.length > 0 && (
          <ImageCarousel
            images={post.mediaUrls}
            alt={`${post.authorName}의 게시물 이미지`}
          />
        )}

        <div className="p-5">
          {/* 작성자 + 날짜 */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold text-inkroot text-sm">
              {post.authorName}
            </span>
            <span className="text-inkroot/40 text-xs">
              {new Date(post.createdAt).toLocaleDateString('ko-KR')}
            </span>
          </div>

          {/* 본문 */}
          <p className="text-inkroot/80 text-sm leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>

          {/* 좋아요 버튼 */}
          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-inkroot/5">
            <button
              type="button"
              onClick={handleLike}
              className="flex items-center gap-1.5 group/like"
              aria-label={liked ? '좋아요 취소' : '좋아요'}
            >
              <svg
                className={`w-6 h-6 transition-all duration-200 ${
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
              <span className={`text-sm font-medium ${liked ? 'text-blush-berry' : 'text-inkroot/40'}`}>
                {likeCount > 0 ? `좋아요 ${likeCount}개` : '좋아요'}
              </span>
            </button>
          </div>

          {/* 촬영일 */}
          {post.takenAt && (
            <p className="mt-3 text-xs text-inkroot/40">
              📸 촬영일:{' '}
              {new Date(post.takenAt).toLocaleDateString('ko-KR')}
            </p>
          )}
        </div>
      </article>

      {/* 댓글 영역 */}
      <section>
        <SectionLabel>댓글 ({comments.length})</SectionLabel>
        <CommentList comments={comments} />
        <div className="mt-3">
          <CommentForm
            targetType={TargetType.POST}
            targetId={post.id}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      </section>
    </div>
  );
}
