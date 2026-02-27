'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { SectionCard } from '@/components/section-card';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/magic-link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        throw new Error(`요청 실패: ${response.status}`);
      }

      const payload = (await response.json()) as {
        data?: { token?: string };
        message?: string;
      };

      if (payload.data?.token) {
        setToken(payload.data.token);
      }

      setStatusMessage(payload.message ?? '매직링크 요청 완료');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '로그인 요청 처리 중 오류가 발생했습니다.'
      );
    }
  }

  async function handleVerifyMagicLink() {
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/auth/magic-link/verify?token=${encodeURIComponent(token)}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error(`매직링크 검증 실패: ${response.status}`);
      }

      setStatusMessage('로그인 성공. 피드 화면으로 이동합니다.');
      router.push('/feed');
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '매직링크 검증 중 오류가 발생했습니다.'
      );
    }
  }

  return (
    <main>
      <div className="page-stack">
        <section className="hero-card">
          <p className="hero-kicker">Welcome Back</p>
          <h1 className="hero-title">로그인</h1>
          <p className="hero-description">
            초대 링크 또는 매직링크로만 접근할 수 있습니다. 토큰 기반 흐름은 개발 환경에서
            쉽게 테스트할 수 있도록 구성했습니다.
          </p>
        </section>

        <div className="login-grid">
          <SectionCard title="1) 매직링크 요청" subtitle="이메일을 입력해 토큰을 발급받습니다.">
            <form className="form-grid" onSubmit={handleSubmit}>
              <input
                className="input-field"
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
              />
              <button type="submit" className="button button-primary">
                매직링크 요청
              </button>
            </form>
          </SectionCard>

          <SectionCard title="2) 토큰 검증" subtitle="발급된 토큰으로 세션을 생성합니다." tone="butter">
            <div className="form-grid">
              <input
                className="input-field"
                type="text"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                placeholder="magic-link token"
              />
              <button type="button" className="button button-ink" onClick={handleVerifyMagicLink}>
                로그인 완료
              </button>
            </div>
          </SectionCard>
        </div>

        <div className="note-strip">
          초대 토큰이 있다면{' '}
          <Link href="/invite/dev-token" style={{ textDecoration: 'underline' }}>
            초대 수락 화면
          </Link>
          에서 바로 진행할 수 있습니다.
        </div>

        {statusMessage ? <p className="status-line">{statusMessage}</p> : null}
        {errorMessage ? <p className="error-box">{errorMessage}</p> : null}
      </div>
    </main>
  );
}
