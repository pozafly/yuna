'use client';

import { useState } from 'react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/auth/magic-link`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (res.ok) setStatus('success');
            else setStatus('error');
        } catch {
            setStatus('error');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-8">
            <h1 className="font-heading text-3xl font-bold mb-8 text-center">
                이메일로 계속하기
            </h1>

            <div className="w-full yuna-card p-6 border border-gray-100">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-500 mb-2">이메일 주소</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            placeholder="yuna@family.com"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full yuna-button-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? '전송 중...' : '매직링크 받기'}
                    </button>
                </form>

                {status === 'success' && (
                    <div className="mt-6 p-4 bg-primary/10 text-primary rounded-2xl text-sm text-center">
                        이메일로 로그인 링크가 전송되었습니다.<br />
                        메일함을 확인해주세요. (개발모드: 콘솔 확인)
                    </div>
                )}

                {status === 'error' && (
                    <div className="mt-4 text-red-500 text-sm text-center">
                        전송에 실패했습니다. 다시 시도해주세요.
                    </div>
                )}
            </div>
        </div>
    );
}
