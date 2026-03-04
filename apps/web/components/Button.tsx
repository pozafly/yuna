'use client';

/**
 * 공통 버튼 컴포넌트
 *
 * 디자인 가이드: 두껍고 둥근 필(알약) 형태, 포인트 색상 사용
 * variant별 색상:
 * - primary: Fresh Stem 배경 + Pure Light 텍스트 (메인 액션 — CTA)
 * - secondary: 아웃라인 알약 (border-2 border-inkroot)
 * - danger: Blush Berry 배경 (위험한 액션)
 * - ghost: 테두리만 있는 투명 버튼
 */

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-fresh-stem text-pure-light hover:bg-fresh-stem/90 active:bg-fresh-stem/80 hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(51,152,51,0.3)]',
  secondary:
    'bg-transparent text-inkroot border-2 border-inkroot hover:bg-inkroot/5 active:bg-inkroot/10',
  danger:
    'bg-blush-berry text-pure-light hover:bg-blush-berry/80 active:bg-blush-berry/60',
  ghost:
    'bg-transparent text-inkroot border-2 border-inkroot/20 hover:bg-soft-dawn active:bg-soft-dawn/60',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-base',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        // 기본 스타일: 알약(pill) 형태
        'rounded-full font-semibold transition-all duration-200',
        'flex items-center justify-center gap-2',
        // variant별 색상
        variantStyles[variant],
        // 크기
        sizeStyles[size],
        // 전체 너비 옵션
        fullWidth ? 'w-full' : '',
        // 비활성 상태
        isDisabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* 로딩 스피너 */}
      {loading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
