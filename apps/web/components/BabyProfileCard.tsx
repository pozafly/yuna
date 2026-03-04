'use client';

/**
 * BabyProfileCard — 아기 프로필 카드 컴포넌트 (컴팩트 버전)
 *
 * 디자인 가이드:
 * - Petal Bloom(#DDA9F3) 배경 + 큰 둥근 모서리(4xl)
 * - 아기 이름 + D+일수 + 역할 배지를 1줄 수평 레이아웃으로 표시
 * - 최소한의 Doodle 장식 (sparkle 1개)
 * - 호버 시 부드러운 스케일 + 그림자 전환
 */

import Doodle from './Doodle';

interface BabyProfileCardProps {
  /** 아기 이름 */
  name: string;
  /** 생년월일 ISO 문자열 (예: "2024-03-15") */
  birthDate?: string | null;
  /** 역할: "OWNER" | "INVITED" */
  role?: string;
  /** 카드 하단 태그라인 (예: "소중한 순간을 함께") */
  tagline?: string;
}

/** birthDate → D+일수 계산 (태어난 날을 D+1로) */
function calcDaysOld(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  const diffMs = now.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

export default function BabyProfileCard({
  name,
  birthDate,
  role = 'INVITED',
  tagline,
}: BabyProfileCardProps) {
  const daysOld = birthDate ? calcDaysOld(birthDate) : null;
  const isOwner = role === 'OWNER';

  return (
    <div
      className="
        relative overflow-hidden
        bg-petal-bloom rounded-4xl p-4
        shadow-card transition-all duration-300
        hover:shadow-card-hover hover:-translate-y-1
        active:scale-[0.99]
      "
    >
      {/* ── 배경 장식 (sparkle 1개만) ── */}
      <div className="absolute top-3 right-4 opacity-30 pointer-events-none" aria-hidden="true">
        <Doodle type="sparkle" size={32} color="#9B4CC4" />
      </div>

      {/* ── 1줄 수평 레이아웃: 이름 + D+일수 + 역할 배지 ── */}
      <div className="relative z-10 flex items-center gap-3">
        {/* 아기 이름 */}
        <h2
          className="font-display font-black text-2xl text-inkroot leading-none tracking-tight"
          style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}
        >
          {name}
        </h2>

        {/* D+일수 */}
        {birthDate && daysOld !== null && (
          <div className="flex items-baseline gap-0.5">
            <span
              className="text-inkroot/50 font-handwrite text-sm"
              style={{ fontFamily: 'var(--font-hand)' }}
            >
              D+
            </span>
            <span
              className="text-inkroot font-black text-xl leading-none"
              style={{ fontFamily: 'var(--font-display)', fontWeight: 900 }}
            >
              {daysOld.toLocaleString()}
            </span>
          </div>
        )}

        {/* 생년월일 미등록 안내 */}
        {!birthDate && (
          <span
            className="text-inkroot/40 text-xs font-handwrite"
            style={{ fontFamily: 'var(--font-hand)' }}
          >
            생년월일 미등록
          </span>
        )}

        {/* 역할 배지 — 우측 끝으로 밀기 */}
        <span
          className={[
            'ml-auto text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0',
            isOwner
              ? 'bg-sunbeam-pop text-inkroot'
              : 'bg-sky-whisper text-inkroot',
          ].join(' ')}
        >
          {isOwner ? '부모' : '가족'}
        </span>
      </div>

      {/* ── tagline (있을 경우) ── */}
      {tagline && (
        <p className="relative z-10 mt-2 text-sm text-inkroot/60 font-sans">
          {tagline}
        </p>
      )}
    </div>
  );
}
