'use client';

/**
 * June — 크림/베이지 고양이 SVG 인라인 컴포넌트
 *
 * 디자인 가이드: 귀여운 일러스트 스타일
 * - 뾰족 삼각 귀, 곡선 꼬리, 수염
 * - 타원 몸통, 점 눈·코
 * - Soft Dawn(#F1F1D2) / Pure Light(#F8F6EC) 크림·베이지 계열 배색
 */

interface JuneProps {
  /** SVG 출력 크기 (px). 기본 120 */
  size?: number;
  className?: string;
}

export default function June({ size = 120, className = '' }: JuneProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="June 고양이 캐릭터"
      role="img"
    >
      {/* ── 꼬리 (곡선 S자) ── */}
      <path
        d="M88 90 C100 80 108 65 100 52 C95 44 86 48 88 58 C90 66 84 74 88 90Z"
        fill="#E8E0C8"
        stroke="#C8B896"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 꼬리 끝 밝은 부분 */}
      <ellipse
        cx="88"
        cy="89"
        rx="5"
        ry="6"
        fill="#F8F6EC"
        stroke="#C8B896"
        strokeWidth="1"
        transform="rotate(10 88 89)"
      />

      {/* ── 몸통 (타원) ── */}
      <ellipse cx="58" cy="82" rx="32" ry="24" fill="#F1F1D2" stroke="#C8B896" strokeWidth="1.5" />

      {/* ── 앞발 왼쪽 ── */}
      <ellipse cx="38" cy="99" rx="9" ry="7" fill="#F1F1D2" stroke="#C8B896" strokeWidth="1.5" />
      {/* 발가락 선 */}
      <path d="M33 101 Q38 104 43 101" stroke="#C8B896" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* ── 앞발 오른쪽 ── */}
      <ellipse cx="72" cy="99" rx="9" ry="7" fill="#F1F1D2" stroke="#C8B896" strokeWidth="1.5" />
      <path d="M67 101 Q72 104 77 101" stroke="#C8B896" strokeWidth="1" fill="none" strokeLinecap="round" />

      {/* ── 머리 ── */}
      <circle cx="58" cy="50" r="26" fill="#F8F6EC" stroke="#C8B896" strokeWidth="1.5" />

      {/* ── 왼쪽 삼각 귀 ── */}
      <path
        d="M36 32 L28 14 L48 26Z"
        fill="#F1F1D2"
        stroke="#C8B896"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 귀 안쪽 분홍 */}
      <path
        d="M37 30 L31 18 L45 27Z"
        fill="#FFB8B8"
        opacity="0.6"
      />

      {/* ── 오른쪽 삼각 귀 ── */}
      <path
        d="M80 32 L88 14 L68 26Z"
        fill="#F1F1D2"
        stroke="#C8B896"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* 귀 안쪽 분홍 */}
      <path
        d="M79 30 L85 18 L71 27Z"
        fill="#FFB8B8"
        opacity="0.6"
      />

      {/* ── 뺨 홍조 ── */}
      <ellipse cx="42" cy="57" rx="7" ry="4.5" fill="#FFB8B8" opacity="0.40" />
      <ellipse cx="74" cy="57" rx="7" ry="4.5" fill="#FFB8B8" opacity="0.40" />

      {/* ── 눈 왼쪽 (아몬드형) ── */}
      <ellipse cx="48" cy="49" rx="4" ry="4.5" fill="#2C2416" />
      <circle cx="49.5" cy="47.5" r="1.4" fill="#FFFFFF" opacity="0.85" />

      {/* ── 눈 오른쪽 ── */}
      <ellipse cx="68" cy="49" rx="4" ry="4.5" fill="#2C2416" />
      <circle cx="69.5" cy="47.5" r="1.4" fill="#FFFFFF" opacity="0.85" />

      {/* ── 코 (하트형 소형) ── */}
      <path
        d="M56 59 C56 57 58 56 58 58 C58 56 60 57 60 59 C60 61 58 63 58 63 C58 63 56 61 56 59Z"
        fill="#E87878"
      />

      {/* ── 입 ── */}
      <path d="M54 64 Q58 68 62 64" stroke="#2C2416" strokeWidth="1.6" strokeLinecap="round" fill="none" />
      {/* 세로 입선 */}
      <path d="M58 63 L58 65" stroke="#2C2416" strokeWidth="1.4" strokeLinecap="round" />

      {/* ── 수염 왼쪽 ── */}
      <path d="M30 55 L46 57" stroke="#C8B896" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M30 59 L46 59" stroke="#C8B896" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M32 63 L46 61" stroke="#C8B896" strokeWidth="1.2" strokeLinecap="round" />

      {/* ── 수염 오른쪽 ── */}
      <path d="M70 57 L86 55" stroke="#C8B896" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M70 59 L86 59" stroke="#C8B896" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M70 61 L84 63" stroke="#C8B896" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
