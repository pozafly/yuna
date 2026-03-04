'use client';

/**
 * 댓글 입력 폼 컴포넌트
 *
 * 디자인 가이드:
 * - 하단에 고정되는 입력 바
 * - Soft Dawn 배경의 둥근 입력창
 * - 전송 버튼: Petal Bloom 원형 버튼
 */

import { useState, useRef } from 'react';
import { api, ApiError } from '../lib/api';
import type { CreateCommentDto, CommentResponseDto } from '@yuna/shared-types';
import { TargetType } from '@yuna/shared-types';

interface CommentFormProps {
  targetType: TargetType;
  targetId: string;
  /** 댓글 전송 성공 시 호출되는 콜백 */
  onCommentAdded: (comment: CommentResponseDto) => void;
}

export default function CommentForm({
  targetType,
  targetId,
  onCommentAdded,
}: CommentFormProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /**
   * 댓글 전송 핸들러
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setError('');

    try {
      const body: CreateCommentDto = {
        targetType,
        targetId,
        content: trimmed,
      };
      const newComment = await api.post<CommentResponseDto>('/comments', body);
      onCommentAdded(newComment);
      setContent('');

      // 입력창 높이 초기화
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('댓글을 전송하지 못했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  /**
   * textarea 높이 자동 조절 핸들러
   */
  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value);
    // 높이를 내용에 맞게 자동 조절 (최대 5줄)
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }

  /**
   * Enter 키 전송 (Shift+Enter는 줄바꿈)
   */
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !isSubmitting) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  }

  return (
    <div className="border-t border-inkroot/5 bg-pure-light px-4 py-3 pb-safe">
      {/* 에러 메시지 */}
      {error && (
        <p className="text-blush-berry text-xs mb-2 px-1 animate-fade-in">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        {/* 댓글 입력 textarea */}
        <div className="flex-1 bg-soft-dawn rounded-3xl px-4 py-2.5">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onKeyDown={handleKeyDown}
            placeholder="댓글을 입력하세요... (Enter로 전송)"
            disabled={isSubmitting}
            rows={1}
            maxLength={500}
            className={[
              'w-full resize-none bg-transparent',
              'text-sm text-inkroot placeholder:text-inkroot/40',
              'leading-relaxed focus:outline-none',
              'disabled:opacity-50',
            ].join(' ')}
            aria-label="댓글 입력"
          />
        </div>

        {/* 전송 버튼 */}
        <button
          type="submit"
          disabled={isSubmitting || !content.trim()}
          className={[
            'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
            'transition-all duration-200',
            content.trim() && !isSubmitting
              ? 'bg-fresh-stem text-pure-light active:scale-90 hover:bg-fresh-stem/90'
              : 'bg-soft-dawn text-inkroot/30',
          ].join(' ')}
          aria-label="댓글 전송"
        >
          {isSubmitting ? (
            // 로딩 스피너
            <span className="w-4 h-4 border-2 border-inkroot/30 border-t-inkroot/70 rounded-full animate-spin" />
          ) : (
            // 전송 화살표 아이콘
            <svg
              className="w-5 h-5 -translate-y-px translate-x-px"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
          )}
        </button>
      </form>
    </div>
  );
}
