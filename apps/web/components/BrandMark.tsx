/**
 * 릴리 플라워 브랜드마크 SVG 컴포넌트
 *
 * 디자인 가이드: 백합꽃 모티브
 * - 상단: 왕관형 꽃잎 (Crowned by Nature)
 * - 하단: 물방울 줄기 (The Essence of Bloom)
 * - 용도: 네비게이션 로고, 로딩 상태, 파비콘
 */

interface BrandMarkProps {
  /** SVG 크기 (px). 기본 32 */
  size?: number;
  /** 꽃잎 색상. 기본 currentColor */
  color?: string;
  className?: string;
}

export default function BrandMark({
  size = 32,
  color = 'currentColor',
  className = '',
}: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* 중앙 꽃잎 (상단 왕관형) */}
      <ellipse cx="32" cy="18" rx="5" ry="12" fill={color} opacity="0.9" />
      {/* 왼쪽 꽃잎 */}
      <ellipse
        cx="20"
        cy="22"
        rx="5"
        ry="11"
        fill={color}
        opacity="0.75"
        transform="rotate(-30 20 22)"
      />
      {/* 오른쪽 꽃잎 */}
      <ellipse
        cx="44"
        cy="22"
        rx="5"
        ry="11"
        fill={color}
        opacity="0.75"
        transform="rotate(30 44 22)"
      />
      {/* 왼쪽 바깥 꽃잎 */}
      <ellipse
        cx="14"
        cy="28"
        rx="4"
        ry="9"
        fill={color}
        opacity="0.55"
        transform="rotate(-55 14 28)"
      />
      {/* 오른쪽 바깥 꽃잎 */}
      <ellipse
        cx="50"
        cy="28"
        rx="4"
        ry="9"
        fill={color}
        opacity="0.55"
        transform="rotate(55 50 28)"
      />
      {/* 꽃 중심 */}
      <circle cx="32" cy="28" r="6" fill={color} opacity="0.4" />
      {/* 하단 줄기 (물방울 형태) */}
      <path
        d="M32 34 C32 34 28 44 28 50 C28 53 30 56 32 56 C34 56 36 53 36 50 C36 44 32 34 32 34Z"
        fill={color}
        opacity="0.6"
      />
    </svg>
  );
}
