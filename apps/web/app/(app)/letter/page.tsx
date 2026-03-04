'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../lib/api';
import Button from '../../../components/Button';
import Sticker from '../../../components/Sticker';
import BrandMark from '../../../components/BrandMark';
import June from '../../../components/June';
import Doodle from '../../../components/Doodle';
import PageHero from '../../../components/PageHero';
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
      <div className="text-center py-16 animate-bounce-soft">
        <BrandMark size={32} color="#DDA9F3" />
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* 페이지 히어로 */}
      <PageHero
        tagline="마음을 담은 편지"
        subtitle="시간이 지나도 변하지 않는 마음을 남겨요"
        variant="dawn"
      />

      <div className="flex justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={() => router.push('/letter/new')}
        >
          + 새 편지
        </Button>
      </div>

      {letters.length === 0 ? (
        <div className="text-center py-16 text-inkroot/40 space-y-4">
          <June size={140} className="mx-auto animate-bounce-soft" />
          <div className="flex justify-center gap-2">
            <Sticker text="hi!" popIn />
            <Sticker text="june" popIn />
          </div>
          <div className="flex justify-center gap-3">
            <Doodle type="flower" size={22} color="var(--color-fresh-stem)" />
            <Doodle type="sparkle" size={18} color="var(--color-petal-bloom)" />
            <Doodle type="heart" size={20} color="var(--color-blush-berry)" />
          </div>
          <p className="display-tagline text-inkroot/60">아직 편지가 없어요</p>
          <p className="text-sm text-inkroot/50">소중한 마음을 담아 편지를 써보세요.</p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => router.push('/letter/new')}
          >
            + 첫 편지 쓰기
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {letters.map((letter) => (
            <button
              key={letter.id}
              onClick={() => router.push(`/letter/${letter.id}`)}
              className="w-full text-left bg-pure-light rounded-4xl overflow-hidden shadow-card hover:shadow-card-hover transition-all active:scale-[0.98]"
            >
              {/* 상단 색상 띠 */}
              <div className="h-1.5 bg-soft-dawn" />
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-display italic text-inkroot text-base">
                    {letter.title}
                  </h3>
                  <span className="border border-inkroot/15 rounded-lg px-2 py-0.5 text-inkroot/50 text-xs shrink-0 ml-2 rotate-1">
                    {new Date(letter.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="text-inkroot/60 text-sm line-clamp-2">
                  {letter.content}
                </p>
                <div className="flex items-center gap-3 mt-3 text-xs text-inkroot/40">
                  <span>{letter.authorName}</span>
                  {letter.commentCount > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {letter.commentCount}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
