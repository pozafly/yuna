'use client';

/**
 * 공통 입력 필드 컴포넌트
 *
 * 디자인 가이드: 큰 둥근 모서리, Soft Dawn 배경, 부드러운 focus 효과
 */

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    // label이 있을 때 id 자동 생성 (접근성)
    const inputId = id ?? (label ? `input-${label}` : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-inkroot mb-1.5 px-1"
          >
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          {...props}
          className={[
            // 기본 스타일: Soft Dawn 배경 + 큰 둥근 모서리
            'w-full px-5 py-3.5 rounded-full',
            'bg-soft-dawn text-inkroot',
            'border-2 border-transparent',
            'placeholder:text-inkroot/40',
            'transition-all duration-200',
            // Focus 효과: Fresh Stem 테두리 + 은은한 링
            'focus:outline-none focus:border-fresh-stem/50 focus:ring-2 focus:ring-fresh-stem/10 focus:bg-pure-light',
            // 에러 상태
            error ? 'border-blush-berry' : '',
            // 비활성 상태
            props.disabled ? 'opacity-50 cursor-not-allowed' : '',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
        />

        {/* 에러 메시지 */}
        {error && (
          <p className="mt-1.5 text-sm text-blush-berry px-1 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
