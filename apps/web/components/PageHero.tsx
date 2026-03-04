'use client';

/**
 * PageHero — 페이지 상단 히어로 섹션 컴포넌트 (슬림 버전)
 *
 * 디자인 가이드:
 * - variant별 배경색 (petal / dawn / dark)
 * - display-tagline 폰트로 메인 문구 표시
 * - 최소한의 Doodle 장식 (sparkle + flower)
 * - 모바일 우선 패딩/레이아웃
 */

import Doodle from './Doodle';

type HeroVariant = 'petal' | 'dawn' | 'dark';

interface PageHeroProps {
  /** display-tagline 클래스로 렌더링할 메인 문구 */
  tagline: string;
  /** 작은 설명 텍스트 */
  subtitle?: string;
  /** 배경 색상 variant */
  variant?: HeroVariant;
  className?: string;
}

/** variant별 배경·텍스트 Tailwind 클래스 */
const variantStyles: Record<HeroVariant, { bg: string; text: string; sub: string }> = {
  petal: {
    bg: 'bg-petal-bloom',
    text: 'text-inkroot',
    sub: 'text-inkroot/65',
  },
  dawn: {
    bg: 'bg-soft-dawn',
    text: 'text-inkroot',
    sub: 'text-inkroot/60',
  },
  dark: {
    bg: 'bg-inkroot',
    text: 'text-pure-light',
    sub: 'text-pure-light/70',
  },
};

/** variant별 Doodle 색상 */
const doodleColors: Record<HeroVariant, string> = {
  petal: '#9B4CC4',
  dawn: '#8B7A00',
  dark: '#DDA9F3',
};

export default function PageHero({
  tagline,
  subtitle,
  variant = 'petal',
  className = '',
}: PageHeroProps) {
  const styles = variantStyles[variant];
  const doodleColor = doodleColors[variant];

  return (
    <section
      className={[
        'relative overflow-hidden',
        'rounded-4xl px-6 py-5 md:px-8 md:py-6',
        styles.bg,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── 배경 낙서 장식 (sparkle + flower만 유지) ── */}
      <div
        className="absolute top-3 right-4 opacity-35 pointer-events-none"
        aria-hidden="true"
      >
        <Doodle type="sparkle" size={40} color={doodleColor} />
      </div>
      <div
        className="absolute bottom-3 right-8 opacity-25 pointer-events-none"
        aria-hidden="true"
      >
        <Doodle type="flower" size={32} color={doodleColor} />
      </div>

      {/* ── 콘텐츠 영역 ── */}
      <div className="relative z-10">
        {/* 메인 tagline */}
        <h1
          className={['display-tagline', styles.text].join(' ')}
        >
          {tagline}
        </h1>

        {/* subtitle */}
        {subtitle && (
          <p
            className={[
              'mt-2 text-sm md:text-base leading-relaxed font-sans max-w-xs md:max-w-sm',
              styles.sub,
            ].join(' ')}
          >
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
