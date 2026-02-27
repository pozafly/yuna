'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { SectionCard } from '@/components/section-card';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function InvitePage() {
  const params = useParams<{ token: string }>();
  const tokenValue = params.token ?? '';
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleAcceptInvite() {
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/invite/verify?token=${encodeURIComponent(tokenValue)}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error(`초대 수락 실패: ${response.status}`);
      }

      setStatusMessage('초대 수락이 완료되었습니다. /feed로 이동해 주세요.');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '초대 수락 중 오류가 발생했습니다.'
      );
    }
  }

  return (
    <main>
      <div className="page-stack">
        <section className="hero-card">
          <p className="hero-kicker">Invitation</p>
          <h1 className="hero-title">초대 수락</h1>
          <p className="hero-description">
            초대 토큰 유효 시간은 30분입니다. 만료되면 OWNER의 재초대가 필요합니다.
          </p>
          <div className="hero-actions">
            <button onClick={handleAcceptInvite} className="button button-primary" type="button">
              초대 수락하기
            </button>
          </div>
        </section>

        <SectionCard title="토큰 정보" subtitle="보안을 위해 토큰은 짧은 TTL로 동작합니다." tone="butter">
          <p style={{ margin: 0, overflowWrap: 'anywhere' }}>{tokenValue || '토큰 로딩 중...'}</p>
        </SectionCard>

        {statusMessage ? <p className="status-line">{statusMessage}</p> : null}
        {errorMessage ? <p className="error-box">{errorMessage}</p> : null}
      </div>
    </main>
  );
}
