'use client';

/**
 * Doodle — 낙서 장식 SVG 컴포넌트 (5종)
 *
 * 디자인 가이드: 손그림 느낌의 장식 요소
 * - star: 별 (6각형 스타일)
 * - heart: 하트
 * - sparkle: 반짝이 (십자형 빛)
 * - flower: 꽃
 * - wave: 물결선
 *
 * 각 타입마다 간단한 SVG path 기반으로 스케치/낙서 느낌을 표현
 */

type DoodleType = 'star' | 'heart' | 'sparkle' | 'flower' | 'wave';

interface DoodleProps {
  type: DoodleType;
  /** SVG 출력 크기 (px). 기본 24 */
  size?: number;
  /** SVG 색상. 기본 currentColor */
  color?: string;
  className?: string;
}

/** 타입별 SVG 내용 렌더링 함수 */
function renderDoodle(type: DoodleType, color: string) {
  switch (type) {
    case 'star':
      return (
        <>
          {/* 4포인트 별 + 가운데 원 — 손그림 느낌 */}
          <path
            d="M12 2 C12 2 13.5 7 12 8 C10.5 7 12 2 12 2Z"
            fill={color}
          />
          <path
            d="M12 22 C12 22 13.5 17 12 16 C10.5 17 12 22 12 22Z"
            fill={color}
          />
          <path
            d="M2 12 C2 12 7 13.5 8 12 C7 10.5 2 12 2 12Z"
            fill={color}
          />
          <path
            d="M22 12 C22 12 17 13.5 16 12 C17 10.5 22 12 22 12Z"
            fill={color}
          />
          {/* 대각선 꼭짓점 (작은) */}
          <path
            d="M5.5 5.5 C5.5 5.5 9 9 8.5 9.5 C8 9 5.5 5.5 5.5 5.5Z"
            fill={color}
            opacity="0.6"
          />
          <path
            d="M18.5 5.5 C18.5 5.5 15 9 15.5 9.5 C16 9 18.5 5.5 18.5 5.5Z"
            fill={color}
            opacity="0.6"
          />
          <path
            d="M5.5 18.5 C5.5 18.5 9 15 8.5 14.5 C8 15 5.5 18.5 5.5 18.5Z"
            fill={color}
            opacity="0.6"
          />
          <path
            d="M18.5 18.5 C18.5 18.5 15 15 15.5 14.5 C16 15 18.5 18.5 18.5 18.5Z"
            fill={color}
            opacity="0.6"
          />
          {/* 중앙 원 */}
          <circle cx="12" cy="12" r="2.5" fill={color} opacity="0.5" />
        </>
      );

    case 'heart':
      return (
        <>
          {/* 하트 path — 약간 불균형한 손그림 스타일 */}
          <path
            d="M12 20.5 C12 20.5 3 14 3 8.5 C3 5.5 5.5 3.5 8.5 3.5 C10.2 3.5 11.4 4.4 12 5.2 C12.6 4.4 13.8 3.5 15.5 3.5 C18.5 3.5 21 5.5 21 8.5 C21 14 12 20.5 12 20.5Z"
            fill={color}
          />
          {/* 하이라이트 */}
          <ellipse cx="8.5" cy="7.5" rx="2" ry="1.5" fill="#FFFFFF" opacity="0.35" transform="rotate(-20 8.5 7.5)" />
        </>
      );

    case 'sparkle':
      return (
        <>
          {/* 중앙 십자 긴 빛 */}
          <path
            d="M12 1 C12 1 11 6 11 12 C11 18 12 23 12 23 C12 23 13 18 13 12 C13 6 12 1 12 1Z"
            fill={color}
          />
          <path
            d="M1 12 C1 12 6 11 12 11 C18 11 23 12 23 12 C23 12 18 13 12 13 C6 13 1 12 1 12Z"
            fill={color}
          />
          {/* 대각선 짧은 빛 */}
          <path
            d="M4.5 4.5 C4.5 4.5 8.5 8.5 8 9 C7.5 8.5 4.5 4.5 4.5 4.5Z"
            fill={color}
            opacity="0.7"
          />
          <path
            d="M19.5 4.5 C19.5 4.5 15.5 8.5 16 9 C16.5 8.5 19.5 4.5 19.5 4.5Z"
            fill={color}
            opacity="0.7"
          />
          <path
            d="M4.5 19.5 C4.5 19.5 8.5 15.5 8 15 C7.5 15.5 4.5 19.5 4.5 19.5Z"
            fill={color}
            opacity="0.7"
          />
          <path
            d="M19.5 19.5 C19.5 19.5 15.5 15.5 16 15 C16.5 15.5 19.5 19.5 19.5 19.5Z"
            fill={color}
            opacity="0.7"
          />
          {/* 중앙 점 */}
          <circle cx="12" cy="12" r="2" fill={color} />
        </>
      );

    case 'flower':
      return (
        <>
          {/* 꽃잎 5개 — 원형 배치 */}
          <ellipse cx="12" cy="5.5" rx="3" ry="4.5" fill={color} opacity="0.75" />
          <ellipse
            cx="18.6"
            cy="8.5"
            rx="3"
            ry="4.5"
            fill={color}
            opacity="0.75"
            transform="rotate(72 18.6 8.5)"
          />
          <ellipse
            cx="16.2"
            cy="17"
            rx="3"
            ry="4.5"
            fill={color}
            opacity="0.75"
            transform="rotate(144 16.2 17)"
          />
          <ellipse
            cx="7.8"
            cy="17"
            rx="3"
            ry="4.5"
            fill={color}
            opacity="0.75"
            transform="rotate(216 7.8 17)"
          />
          <ellipse
            cx="5.4"
            cy="8.5"
            rx="3"
            ry="4.5"
            fill={color}
            opacity="0.75"
            transform="rotate(288 5.4 8.5)"
          />
          {/* 꽃 중심 */}
          <circle cx="12" cy="12" r="3.5" fill={color} />
          <circle cx="12" cy="12" r="2" fill="#FFFFFF" opacity="0.5" />
        </>
      );

    case 'wave':
      return (
        <>
          {/* 물결선 3줄 — 손그림 느낌의 굴곡 */}
          <path
            d="M2 7 C4 5 6 9 8 7 C10 5 12 9 14 7 C16 5 18 9 20 7 C21 6 22 6.5 22 6.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M2 12 C4 10 6 14 8 12 C10 10 12 14 14 12 C16 10 18 14 20 12 C21 11 22 11.5 22 11.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M2 17 C4 15 6 19 8 17 C10 15 12 19 14 17 C16 15 18 19 20 17 C21 16 22 16.5 22 16.5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </>
      );

    default:
      return null;
  }
}

export default function Doodle({
  type,
  size = 24,
  color = 'currentColor',
  className = '',
}: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {renderDoodle(type, color)}
    </svg>
  );
}
