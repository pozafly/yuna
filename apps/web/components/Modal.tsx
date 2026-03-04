'use client';

/**
 * 모달 컴포넌트
 *
 * 디자인 가이드:
 * - Pure Light 배경 + 큰 둥근 모서리 (4xl)
 * - 배경 오버레이: 어두운 반투명
 * - 부드러운 fade-in 애니메이션
 * - 모바일: 하단에서 슬라이드 업
 */

import { useEffect, ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** 하단 시트 스타일 (모바일 최적화) */
  bottomSheet?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  bottomSheet = false,
}: ModalProps) {
  // 모달 열림 시 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // 오버레이 (클릭 시 모달 닫기)
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* 반투명 어두운 배경 */}
      <div className="absolute inset-0 bg-inkroot/50 backdrop-blur-sm" />

      {/* 모달 컨텐츠 (클릭 이벤트 전파 차단) */}
      <div
        className={[
          'relative z-10 w-full bg-pure-light shadow-lg',
          'animate-slide-up',
          bottomSheet
            ? // 하단 시트: 하단 둥근 모서리 없음
              'rounded-t-4xl max-h-[85vh] overflow-y-auto mx-0 pb-safe'
            : // 일반 모달: 전체 둥근 모서리
              'rounded-4xl max-w-sm mx-4',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 헤더 */}
        {(title ?? bottomSheet) && (
          <div className="flex items-center justify-between p-5 border-b border-inkroot/5">
            {/* 하단 시트 드래그 핸들 */}
            {bottomSheet && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-inkroot/20" />
            )}

            {title && (
              <h3 className="font-serif text-lg font-bold text-inkroot">
                {title}
              </h3>
            )}

            {/* 닫기 버튼 */}
            <button
              onClick={onClose}
              className="ml-auto p-1.5 rounded-full hover:bg-soft-dawn transition-colors duration-150 text-inkroot/50 hover:text-inkroot"
              aria-label="모달 닫기"
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
        )}

        {/* 모달 바디 */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
