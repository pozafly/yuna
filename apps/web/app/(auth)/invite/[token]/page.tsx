'use client';

/**
 * 초대 수락 페이지 (S-AUTH-02 / S-AUTH-03)
 *
 * 동작 흐름:
 * 1. URL의 token 파라미터로 초대 정보를 조회한다.
 * 2. 토큰이 유효하지 않거나 만료된 경우 안내 메시지를 표시한다.
 * 3. 신규 사용자: 이름 입력 후 가입 처리 (RegisterDto 사용)
 * 4. 기존 사용자: 바로 수락 처리 후 피드로 이동
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '../../../../lib/api';
import Button from '../../../../components/Button';
import Input from '../../../../components/Input';
import type { RegisterDto } from '@yuna/shared-types';

interface PageProps {
  params: { token: string };
}

// 초대 정보 응답 타입 (BE에서 내려주는 초대 미리보기 데이터)
interface InviteInfo {
  babyName: string;
  inviterName: string;
  isNewUser: boolean;
  inviteeEmail: string;
}

type PageState = 'loading' | 'valid' | 'register' | 'error' | 'expired';

export default function InvitePage({ params }: PageProps) {
  const { token } = params;
  const router = useRouter();

  const [pageState, setPageState] = useState<PageState>('loading');
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 초대 토큰 검증 (마운트 시 실행)
  useEffect(() => {
    async function verifyInvite() {
      try {
        const info = await api.get<InviteInfo>(
          `/invitations/verify?token=${token}`,
        );
        setInviteInfo(info);
        // 신규 사용자는 이름 입력 폼으로, 기존 사용자는 바로 수락 화면으로
        setPageState(info.isNewUser ? 'register' : 'valid');
      } catch (err) {
        if (err instanceof ApiError) {
          setPageState(err.status === 410 ? 'expired' : 'error');
        } else {
          setPageState('error');
        }
      }
    }

    verifyInvite();
  }, [token]);

  /**
   * 신규 사용자 가입 + 초대 수락 핸들러
   * 이름을 입력받아 계정을 생성하고 초대를 수락한다.
   */
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError('이름을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const body: RegisterDto = { name: name.trim(), token };
      await api.post('/auth/register', body);
      // 가입 완료 후 피드로 이동
      router.replace('/feed');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('가입 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
      setIsSubmitting(false);
    }
  }

  /**
   * 기존 사용자 초대 수락 핸들러
   * 이미 로그인된 사용자가 초대를 수락한다.
   */
  async function handleAccept() {
    setIsSubmitting(true);
    setError('');

    try {
      await api.post(`/invitations/accept`, { token });
      router.replace('/feed');
    } catch (err) {
      if (err instanceof ApiError) {
        // 로그인이 필요한 경우 로그인 페이지로 이동
        if (err.status === 401) {
          router.replace(`/login?redirectTo=/invite/${token}`);
          return;
        }
        setError(err.message);
      } else {
        setError('수락 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');
      }
      setIsSubmitting(false);
    }
  }

  // 로딩 중
  if (pageState === 'loading') {
    return (
      <div className="text-center py-8 animate-fade-in">
        <div className="w-10 h-10 border-4 border-petal-bloom border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-inkroot/60 text-sm">초대 정보를 확인하고 있어요...</p>
      </div>
    );
  }

  // 토큰 만료
  if (pageState === 'expired') {
    return (
      <div className="text-center py-4 animate-fade-in">
        <div className="text-5xl mb-4">⏰</div>
        <h2 className="font-serif text-2xl font-bold text-inkroot mb-3">
          초대가 만료되었습니다
        </h2>
        <p className="text-inkroot/60 text-sm leading-relaxed mb-6">
          초대 링크의 유효 시간(30분)이 지났습니다.
          <br />
          초대를 보낸 분께 재초대를 요청해 주세요.
        </p>
        <Button variant="ghost" size="md" onClick={() => router.push('/login')}>
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  // 오류
  if (pageState === 'error') {
    return (
      <div className="text-center py-4 animate-fade-in">
        <div className="text-5xl mb-4">🔗</div>
        <h2 className="font-serif text-2xl font-bold text-inkroot mb-3">
          유효하지 않은 초대입니다
        </h2>
        <p className="text-inkroot/60 text-sm leading-relaxed mb-6">
          초대 링크가 취소되었거나 올바르지 않습니다.
          <br />
          초대를 보낸 분께 다시 확인해 주세요.
        </p>
        <Button variant="ghost" size="md" onClick={() => router.push('/login')}>
          로그인 페이지로 이동
        </Button>
      </div>
    );
  }

  // 신규 사용자: 이름 입력 + 가입
  if (pageState === 'register' && inviteInfo) {
    return (
      <div className="animate-fade-in">
        {/* 초대 정보 헤더 */}
        <div className="mb-6 p-4 rounded-3xl bg-petal-bloom/20 text-center">
          <p className="font-handwrite text-lg text-inkroot/70 mb-1">
            {inviteInfo.inviterName}님이 초대했어요
          </p>
          <p className="font-serif text-xl font-bold text-inkroot">
            {inviteInfo.babyName}&apos;s Day
          </p>
        </div>

        <h2 className="font-serif text-2xl font-bold text-inkroot mb-2">
          가입하기
        </h2>
        <p className="text-inkroot/60 text-sm mb-6">
          가족에게 표시될 이름을 입력해 주세요.
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* 이메일 표시 (수정 불가) */}
          <div className="px-4 py-3 rounded-3xl bg-soft-dawn text-inkroot/60 text-sm">
            {inviteInfo.inviteeEmail}
          </div>

          <Input
            type="text"
            placeholder="이름 (예: 엄마, 아빠, 할머니)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
            autoFocus
            maxLength={20}
          />

          {error && (
            <p className="text-blush-berry text-sm px-1 animate-fade-in">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
          >
            가입 완료하기
          </Button>
        </form>
      </div>
    );
  }

  // 기존 사용자: 초대 수락 화면
  if (pageState === 'valid' && inviteInfo) {
    return (
      <div className="animate-fade-in text-center">
        {/* 초대 정보 */}
        <div className="mb-6 p-4 rounded-3xl bg-petal-bloom/20">
          <p className="font-handwrite text-lg text-inkroot/70 mb-1">
            {inviteInfo.inviterName}님이 초대했어요
          </p>
          <p className="font-serif text-2xl font-bold text-inkroot">
            {inviteInfo.babyName}&apos;s Day
          </p>
        </div>

        <h2 className="font-serif text-xl font-bold text-inkroot mb-3">
          초대를 수락하시겠어요?
        </h2>
        <p className="text-inkroot/60 text-sm leading-relaxed mb-6">
          수락하면 {inviteInfo.babyName}의 소중한 기록을
          <br />
          함께 볼 수 있게 됩니다.
        </p>

        {error && (
          <p className="text-blush-berry text-sm mb-4 animate-fade-in">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            loading={isSubmitting}
            onClick={handleAccept}
          >
            초대 수락하기
          </Button>
          <Button
            variant="ghost"
            size="md"
            fullWidth
            onClick={() => router.push('/login')}
          >
            다른 계정으로 로그인
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
