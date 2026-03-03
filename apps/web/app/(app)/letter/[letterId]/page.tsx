'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import CommentList from '../../../../components/CommentList';
import CommentForm from '../../../../components/CommentForm';
import { TargetType } from '@yuna/shared-types';
import type { LetterResponseDto, CommentResponseDto } from '@yuna/shared-types';

export default function LetterDetailPage() {
  const { letterId } = useParams<{ letterId: string }>();
  const router = useRouter();
  const [letter, setLetter] = useState<LetterResponseDto | null>(null);
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!letterId) return;

    Promise.all([
      api.get<{ data: LetterResponseDto }>(`/letters/${letterId}`),
      api.get<{ data: CommentResponseDto[] }>(
        `/letters/${letterId}/comments`,
      ),
    ])
      .then(([letterRes, commentsRes]) => {
        setLetter(letterRes.data);
        setComments(commentsRes.data);
      })
      .catch(() => router.push('/letter'))
      .finally(() => setLoading(false));
  }, [letterId, router]);

  const handleCommentAdded = (comment: CommentResponseDto) => {
    setComments((prev) => [...prev, comment]);
  };

  if (loading) {
    return (
      <div className="text-center py-16 animate-bounce-soft text-2xl">💌</div>
    );
  }

  if (!letter) return null;

  return (
    <div className="animate-fade-in space-y-4">
      <button
        onClick={() => router.back()}
        className="text-inkroot/50 text-sm hover:text-inkroot transition"
      >
        ← 편지 목록으로
      </button>

      {/* 편지 내용 */}
      <article className="bg-soft-dawn/30 rounded-4xl p-6 border border-inkroot/5">
        <h2 className="font-serif text-2xl font-bold text-inkroot mb-2">
          {letter.title}
        </h2>
        <div className="flex items-center gap-2 mb-6 text-xs text-inkroot/40">
          <span>{letter.authorName}</span>
          <span>·</span>
          <span>
            {new Date(letter.createdAt).toLocaleDateString('ko-KR')}
          </span>
        </div>
        <p className="text-inkroot/80 text-sm leading-relaxed whitespace-pre-wrap font-serif">
          {letter.content}
        </p>
      </article>

      {/* 댓글 */}
      <section>
        <h3 className="font-serif text-lg font-bold text-inkroot mb-3">
          댓글 ({comments.length})
        </h3>
        <CommentList comments={comments} />
        <div className="mt-3">
          <CommentForm
            targetType={TargetType.LETTER}
            targetId={letter.id}
            onCommentAdded={handleCommentAdded}
          />
        </div>
      </section>
    </div>
  );
}
