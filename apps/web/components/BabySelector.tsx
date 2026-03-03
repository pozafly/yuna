'use client';

/**
 * Baby 선택 드롭다운 컴포넌트
 *
 * 여러 Baby가 있을 경우 현재 보고 있는 Baby를 전환할 수 있다.
 * 하단 시트 형태의 모달로 Baby 목록을 표시한다.
 */

import { useState } from 'react';
import Modal from './Modal';

interface BabyInfo {
  id: string;
  name: string;
  role: string;
  birthDate?: string | null;
}

interface BabySelectorProps {
  babies: BabyInfo[];
  selected: BabyInfo | null;
  onSelect: (baby: BabyInfo) => void;
}

export default function BabySelector({
  babies,
  selected,
  onSelect,
}: BabySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedBaby = selected;

  // Baby가 1명뿐이면 전환 UI 불필요
  if (babies.length <= 1) {
    return (
      <span className="font-serif text-lg font-bold text-inkroot">
        {selectedBaby?.name ?? 'Yuna'}&apos;s Day
      </span>
    );
  }

  return (
    <>
      {/* 현재 선택된 Baby 표시 버튼 */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 font-serif text-lg font-bold text-inkroot hover:opacity-70 transition-opacity"
        aria-label="Baby 전환"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedBaby?.name ?? 'Yuna'}&apos;s Day
        {/* 드롭다운 화살표 */}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Baby 선택 모달 (하단 시트) */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Baby 전환"
        bottomSheet
      >
        <ul role="listbox" aria-label="Baby 목록" className="space-y-2">
          {babies.map((baby) => {
            const isSelected = baby.id === selected?.id;

            return (
              <li key={baby.id}>
                <button
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onSelect(baby);
                    setIsOpen(false);
                  }}
                  className={[
                    'w-full flex items-center justify-between px-4 py-3.5',
                    'rounded-3xl transition-all duration-150',
                    isSelected
                      ? 'bg-petal-bloom font-semibold'
                      : 'hover:bg-soft-dawn',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <div className="text-left">
                    <p className="font-semibold text-inkroot">{baby.name}</p>
                    {baby.birthDate && (
                      <p className="text-xs text-inkroot/50 mt-0.5">
                        {new Date(baby.birthDate).toLocaleDateString('ko-KR')} 출생
                      </p>
                    )}
                  </div>

                  {/* 선택된 Baby 체크 표시 */}
                  {isSelected && (
                    <svg
                      className="w-5 h-5 text-inkroot"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </Modal>
    </>
  );
}
