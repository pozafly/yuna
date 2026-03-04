'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import CommentList from '../../../../components/CommentList';
import CommentForm from '../../../../components/CommentForm';
import SectionLabel from '../../../../components/SectionLabel';
import BrandMark from '../../../../components/BrandMark';
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
        {/* 이미지 캐러셀 (간단 구현) */}
        {post.mediaUrls.length > 0 && (
          <div className="aspect-square bg-soft-dawn flex items-center justify-center overflow-hidden">
            <div className="text-inkroot/30 text-sm">
              [이미지: {post.mediaUrls.length}장]
            </div>
          </div>
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
