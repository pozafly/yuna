/**
 * 스티커 컴포넌트 — 알약형 배지 텍스트
 *
 * 디자인 가이드: 손그림 느낌의 낙서 스티커
 * - Caveat 폰트, 알약(pill) 형태, 살짝 기울어진 자연스러움
 * - 프리셋 7종: cute, baby, hi!, wow, yoo!, noah, june
 * - floating → animate-float, popIn → animate-sticker-pop
 */

interface StickerProps {
  /** 스티커에 표시할 텍스트 */
  text: string;
  /** 배경색 (Tailwind 클래스 또는 커스텀) */
  bgColor?: string;
  /** 텍스트색 (Tailwind 클래스 또는 커스텀) */
  textColor?: string;
  /** CSS rotate 값 (예: '-5deg', '3deg') */
  rotation?: string;
  /** 떠다니는 애니메이션 적용 여부 */
  floating?: boolean;
  /** 등장 팝 애니메이션 적용 여부 */
  popIn?: boolean;
  className?: string;
}

/** 프리셋 스티커 스타일 매핑 */
const presets: Record<string, { bg: string; text: string; rotation: string }> = {
  cute: { bg: 'bg-sky-whisper', text: 'text-inkroot', rotation: '-5deg' },
  baby: { bg: 'bg-blush-berry', text: 'text-pure-light', rotation: '3deg' },
  'hi!': { bg: 'bg-pure-light', text: 'text-inkroot', rotation: '-3deg' },
  wow: { bg: 'bg-blush-berry', text: 'text-pure-light', rotation: '5deg' },
  'yoo!': { bg: 'bg-petal-bloom', text: 'text-inkroot', rotation: '-4deg' },
  noah: { bg: 'bg-soft-dawn', text: 'text-inkroot', rotation: '2deg' },
  june: { bg: 'bg-fresh-stem', text: 'text-pure-light', rotation: '-2deg' },
};

export default function Sticker({
  text,
  bgColor,
  textColor,
  rotation,
  floating = false,
  popIn = false,
  className = '',
}: StickerProps) {
  /* 프리셋 자동 매핑 (소문자 비교) */
  const preset = presets[text.toLowerCase()];
  const bg = bgColor ?? preset?.bg ?? 'bg-soft-dawn';
  const color = textColor ?? preset?.text ?? 'text-inkroot';
  const rotate = rotation ?? preset?.rotation ?? '-3deg';

  return (
    <span
      className={[
        'sticker',
        bg,
        color,
        floating ? 'animate-float' : '',
        popIn ? 'animate-sticker-pop' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ transform: `rotate(${rotate})` }}
    >
      {text}
    </span>
  );
}
