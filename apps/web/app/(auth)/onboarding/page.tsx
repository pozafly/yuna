'use client';

import { useState } from 'react';

export default function OnboardingPage() {
    const [babyName, setBabyName] = useState('');
    const [birthDate, setBirthDate] = useState('');

    return (
        <div className="min-h-[80vh] flex flex-col justify-center px-8 relative">
            <div className="absolute top-12 left-8 w-12 h-12 bg-primary/20 rounded-full blur-xl" />
            <div className="absolute top-32 right-12 w-20 h-20 bg-peach-accent/30 rounded-full blur-2xl" />

            <h1 className="font-heading text-3xl font-bold mb-3">
                우리 아기 등록하기
            </h1>
            <p className="text-gray-500 mb-10">
                먼저 아기 정보를 입력해주세요. <br />
                언제든 수정할 수 있어요.
            </p>

            <div className="yuna-card p-6 border border-gray-100 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">아기 이름 (또는 태명)</label>
                    <input
                        type="text"
                        value={babyName}
                        onChange={(e) => setBabyName(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all font-medium"
                        placeholder="유나"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">생일 (또는 출산 예정일)</label>
                    <input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-gray-600 font-medium"
                    />
                </div>

                <button
                    className="w-full yuna-button-primary mt-4 disabled:opacity-50"
                    disabled={!babyName || !birthDate}
                >
                    등록 완료
                </button>
            </div>
        </div>
    );
}
