'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../../../lib/api';
import { Visibility } from '@yuna/shared-types';
import Button from '../../../../components/Button';
import ImageUploader from '../../../../components/ImageUploader';
import type { ImageUploaderRef } from '../../../../components/ImageUploader';

export default function NewPostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<Visibility>(Visibility.INVITED);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const uploaderRef = useRef<ImageUploaderRef>(null);

  const getBabyId = useCallback(() => {
    return document.querySelector('main')?.dataset.babyId ?? '';
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) {
      setError('내용을 입력해 주세요.');
      return;
    }

    const babyId = getBabyId();
    if (!babyId) return;

    setLoading(true);
    setError('');

    try {
      // 1. 이미지가 있으면 먼저 업로드
      let mediaKeys: string[] = [];
      if (uploaderRef.current?.hasFiles()) {
        mediaKeys = await uploaderRef.current.uploadAll();
      }

      // 2. 게시물 생성
      await api.post('/posts', {
        babyId,
        content: content.trim(),
        visibility,
        ...(mediaKeys.length > 0 && { mediaKeys }),
      });
      router.push('/feed');
    } catch {
      setError('게시물 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  const babyId = getBabyId();

  return (
    <div className="animate-fade-in">
      <h2 className="font-display text-xl font-bold text-inkroot mb-6">
        새 게시물
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 사진 첨부 */}
        {babyId && (
          <ImageUploader ref={uploaderRef} babyId={babyId} maxFiles={10} />
        )}

        {/* 본문 */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="아이의 소중한 순간을 기록해 보세요..."
          rows={6}
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
            게시하기
          </Button>
        </div>
      </form>
    </div>
  );
}
