'use client';

/**
 * 이미지 캐러셀 컴포넌트
 *
 * - 좌우 스와이프 (터치 디바이스)
 * - 화살표 버튼 (데스크탑)
 * - 하단 도트 인디케이터
 */

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
}

export default function ImageCarousel({ images, alt = '게시물 이미지' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= images.length) return;
      setCurrentIndex(index);
    },
    [images.length],
  );

  const goPrev = useCallback(() => goTo(currentIndex - 1), [currentIndex, goTo]);
  const goNext = useCallback(() => goTo(currentIndex + 1), [currentIndex, goTo]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (diff > threshold) {
      goNext();
    } else if (diff < -threshold) {
      goPrev();
    }
  };

  if (images.length === 0) return null;

  // 단일 이미지일 때는 캐러셀 UI 없이 표시
  if (images.length === 1) {
    return (
      <div className="relative aspect-square bg-soft-dawn overflow-hidden">
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 630px) 100vw, 630px"
        />
      </div>
    );
  }

  return (
    <div
      className="relative aspect-square bg-soft-dawn overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 이미지 슬라이드 */}
      <div
        className="flex h-full transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="relative w-full h-full flex-shrink-0">
            <Image
              src={src}
              alt={`${alt} ${i + 1}/${images.length}`}
              fill
              className="object-cover"
              sizes="(max-width: 630px) 100vw, 630px"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* 좌우 화살표 (데스크탑) */}
      {currentIndex > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
            bg-pure-light/80 shadow-md flex items-center justify-center
            hover:bg-pure-light transition opacity-0 md:opacity-100 md:hover:scale-110"
          aria-label="이전 이미지"
        >
          <svg className="w-4 h-4 text-inkroot" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full
            bg-pure-light/80 shadow-md flex items-center justify-center
            hover:bg-pure-light transition opacity-0 md:opacity-100 md:hover:scale-110"
          aria-label="다음 이미지"
        >
          <svg className="w-4 h-4 text-inkroot" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* 이미지 카운터 배지 */}
      <div className="absolute top-3 right-3 bg-inkroot/60 text-pure-light text-xs font-semibold px-2.5 py-1 rounded-full">
        {currentIndex + 1}/{images.length}
      </div>

      {/* 도트 인디케이터 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
              i === currentIndex
                ? 'bg-pure-light w-3'
                : 'bg-pure-light/50 hover:bg-pure-light/70'
            }`}
            aria-label={`이미지 ${i + 1}로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
