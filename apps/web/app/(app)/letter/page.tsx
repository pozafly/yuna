'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import Button from '../../../components/Button';
import type { LetterResponseDto } from '@yuna/shared-types';

export default function LetterListPage() {
  const router = useRouter();
  const [letters, setLetters] = useState<LetterResponseDto[]>([]);
  const [loading, setLoading] = useState(true);

  const getBabyId = useCallback(() => {
    return document.querySelector('main')?.dataset.babyId ?? '';
  }, []);

  useEffect(() => {
    const babyId = getBabyId();
    if (!babyId) return;

    api
      .get<{
        data: { data: LetterResponseDto[] };
      }>(`/babies/${babyId}/letters?page=1&limit=50`)
      .then((res) => setLetters(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [getBabyId]);

  if (loading) {
    return (
      <div className="text-center py-16 animate-bounce-soft text-2xl">💌</div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-inkroot">편지</h2>
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/letter/new')}
        >
          + 새 편지
        </Button>
      </div>

      {letters.length === 0 ? (
        <div className="text-center py-16 text-inkroot/40">
          <p className="text-4xl mb-3">💌</p>
          <p className="text-sm">아직 편지가 없습니다.</p>
          <p className="text-xs mt-1">소중한 마음을 담아 편지를 써보세요.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {letters.map((letter) => (
            <button
              key={letter.id}
              onClick={() => router.push(`/letter/${letter.id}`)}
              className="w-full text-left bg-soft-dawn/50 rounded-4xl p-5 border border-inkroot/5 hover:bg-soft-dawn/80 transition-all active:scale-[0.98]"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-serif font-bold text-inkroot text-base">
                  {letter.title}
                </h3>
                <span className="text-inkroot/40 text-xs shrink-0 ml-2">
                  {new Date(letter.createdAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <p className="text-inkroot/60 text-sm line-clamp-2">
                {letter.content}
              </p>
              <div className="flex items-center gap-3 mt-3 text-xs text-inkroot/40">
                <span>{letter.authorName}</span>
                {letter.commentCount > 0 && (
                  <span>💬 {letter.commentCount}</span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
