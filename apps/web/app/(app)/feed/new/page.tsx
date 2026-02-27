'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
    const router = useRouter();
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState('INVITED');

    return (
        <div className="min-h-screen bg-white">
            <header className="px-4 h-14 flex items-center justify-between border-b border-gray-100">
                <button onClick={() => router.back()} className="text-gray-500 p-2">
                    취소
                </button>
                <h1 className="font-heading font-bold text-lg">새 게시물</h1>
                <button className="text-primary font-medium p-2 disabled:opacity-50" disabled={!content.trim()}>
                    공유
                </button>
            </header>

            <main className="p-4 flex flex-col gap-4">
                {/* 임시 사진 선택기 */}
                <div className="aspect-square bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors">
                    <span className="text-3xl mb-2">📸</span>
                    <span className="text-sm">사진 추가 (최대 10장)</span>
                </div>

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="오늘 유나의 하루는 어땠나요?"
                    className="w-full h-32 resize-none text-base outline-none pt-2 font-serif placeholder:text-gray-300"
                />

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-sm font-medium">공개 범위</span>
                    <select
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                        className="text-sm bg-gray-50 border-none rounded-full px-4 py-2 outline-none font-medium text-gray-700"
                    >
                        <option value="INVITED">가족 모두에게</option>
                        <option value="PRIVATE">나만 보기</option>
                    </select>
                </div>
            </main>
        </div>
    );
}
