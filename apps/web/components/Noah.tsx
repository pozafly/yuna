'use client';

/**
 * Noah — 크림/베이지 강아지 SVG 인라인 컴포넌트
 *
 * 디자인 가이드: 귀여운 일러스트 스타일
 * - 둥근 머리, 축 처진 귀, 타원 몸통
 * - 점 눈·코, 꼬리, 네 발
 * - Soft Dawn(#F1F1D2) / Pure Light(#FFFFFF) 크림·베이지 계열 배색
 */

interface NoahProps {
  /** SVG 출력 크기 (px). 기본 120 */
  size?: number;
  className?: string;
}

export default function Noah({ size = 120, className = '' }: NoahProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Noah 강아지 캐릭터"
      role="img"
    >
      {/* ── 꼬리 (몸 뒤쪽, 레이어 아래에 위치) ── */}
      <path
        d="M92 72 C102 66 110 58 106 50 C103 44 96 46 94 52 C92 58 96 66 92 72Z"
        fill="#E8E0C8"
        stroke="#C8B896"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* ── 몸통 (타원) ── */}
      <ellipse cx="60" cy="80" rx="34" ry="26" fill="#F1F1D2" stroke="#C8B896" strokeWidth="1.5" />

      {/* ── 앞발 왼쪽 ── */}
      <ellipse cx="38" cy="100" rx="9" ry="7" fill="#F1F1D2" stroke="#C8B896" strokeWidth="1.5" />
      {/* 발가락 왼쪽 */}
      <circle cx="33" cy="103" r="2.5" fill="#E8E0C8" stroke="#C8B896" strokeWidth="1" />
      <circle cx="38" cy="105" r="2.5" fill="#E8E0C8" stroke="#C8B896" strokeWidth="1" />
      <circle cx="43" cy="103" r="2.5" fill="#E8E0C8" stroke="#C8B896" strokeWidth="1" />

      {/* ── 앞발 오른쪽 ── */}
      <ellipse cx="76" cy="100" rx="9" ry="7" fill="#F1F1D2" stroke="#C8B896" strokeWidth="1.5" />
      {/* 발가락 오른쪽 */}
      <circle cx="71" cy="103" r="2.5" fill="#E8E0C8" stroke="#C8B896" strokeWidth="1" />
      <circle cx="76" cy="105" r="2.5" fill="#E8E0C8" stroke="#C8B896" strokeWidth="1" />
      <circle cx="81" cy="103" r="2.5" fill="#E8E0C8" stroke="#C8B896" strokeWidth="1" />

      {/* ── 왼쪽 귀 (축 처진 형태) ── */}
      <ellipse
        cx="34"
        cy="46"
        rx="10"
        ry="14"
        fill="#C8B896"
        stroke="#B0A080"
        strokeWidth="1.5"
        transform="rotate(15 34 46)"
      />

      {/* ── 오른쪽 귀 ── */}
      <ellipse
        cx="86"
        cy="46"
        rx="10"
        ry="14"
        fill="#C8B896"
        stroke="#B0A080"
        strokeWidth="1.5"
        transform="rotate(-15 86 46)"
      />

      {/* ── 머리 (둥근 원) ── */}
      <circle cx="60" cy="52" r="26" fill="#F8F6EC" stroke="#C8B896" strokeWidth="1.5" />

      {/* ── 뺨 홍조 ── */}
      <ellipse cx="45" cy="58" rx="6" ry="4" fill="#FFB8B8" opacity="0.45" />
      <ellipse cx="75" cy="58" rx="6" ry="4" fill="#FFB8B8" opacity="0.45" />

      {/* ── 눈 왼쪽 ── */}
      <circle cx="50" cy="50" r="3.5" fill="#2C2416" />
      <circle cx="51.2" cy="48.8" r="1.2" fill="#FFFFFF" opacity="0.8" />

      {/* ── 눈 오른쪽 ── */}
      <circle cx="70" cy="50" r="3.5" fill="#2C2416" />
      <circle cx="71.2" cy="48.8" r="1.2" fill="#FFFFFF" opacity="0.8" />

      {/* ── 코 (짧은 타원) ── */}
      <ellipse cx="60" cy="60" rx="5" ry="3.5" fill="#2C2416" />
      <ellipse cx="59" cy="59" rx="2" ry="1.2" fill="#FFFFFF" opacity="0.4" />

      {/* ── 입 ── */}
      <path
        d="M55 64 Q60 69 65 64"
        stroke="#2C2416"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
