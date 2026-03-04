'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { Visibility } from '@yuna/shared-types';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';

export default function NewLetterPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.INVITED);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getBabyId = useCallback(() => {
    return document.querySelector('main')?.dataset.babyId ?? '';
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('제목을 입력해 주세요.');
      return;
    }
    if (!content.trim()) {
      setError('내용을 입력해 주세요.');
      return;
    }

    const babyId = getBabyId();
    if (!babyId) return;

    setLoading(true);
    setError('');

    try {
      await api.post('/letters', {
        babyId,
        title: title.trim(),
        content: content.trim(),
        visibility,
      });
      router.push('/letter');
    } catch {
      setError('편지 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-bold text-inkroot mb-6">
        새 편지
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 제목 */}
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="편지 제목"
        />

        {/* 본문 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="소중한 마음을 담아 편지를 써보세요..."
          rows={10}
          className="w-full px-5 py-4 rounded-3xl bg-soft-dawn text-inkroot border-2 border-transparent placeholder:text-inkroot/40 transition-all duration-200 focus:outline-none focus:border-fresh-stem/50 focus:ring-2 focus:ring-fresh-stem/10 focus:bg-pure-light resize-none"
        />

        {/* 공개 범위 */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-inkroot">공개 범위</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setVisibility(Visibility.INVITED)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                visibility === Visibility.INVITED
                  ? 'bg-fresh-stem text-pure-light'
                  : 'bg-soft-dawn text-inkroot/60'
              }`}
            >
              가족 전체
            </button>
            <button
              type="button"
              onClick={() => setVisibility(Visibility.PRIVATE)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                visibility === Visibility.PRIVATE
                  ? 'bg-fresh-stem text-pure-light'
                  : 'bg-soft-dawn text-inkroot/60'
              }`}
            >
              나만 보기
            </button>
          </div>
        </div>

        {error && (
          <p className="text-blush-berry text-sm px-1">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => router.back()}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            fullWidth
            loading={loading}
          >
            편지 보내기
          </Button>
        </div>
      </form>
    </div>
  );
}
