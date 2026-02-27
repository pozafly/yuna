'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewLetterPage() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    return (
        <div className="min-h-screen bg-[#FEFBF6]">
            <header className="px-4 h-14 flex items-center justify-between">
                <button onClick={() => router.back()} className="text-gray-500 p-2">취소</button>
                <h1 className="font-heading font-bold text-lg text-primary">미래로 보내는 편지</h1>
                <button className="text-primary font-bold p-2 disabled:opacity-50" disabled={!title.trim() || !content.trim()}>
                    밀봉하기
                </button>
            </header>

            <main className="p-6">
                <div className="yuna-card p-6 min-h-[60vh] flex flex-col shadow-md border border-[#F4EDE1]">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="제목을 적어주세요"
                        className="font-heading text-xl font-bold bg-transparent border-b border-dashed border-gray-200 pb-2 mb-4 outline-none placeholder:text-gray-300"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="이 편지를 열어볼 아이에게 전하고 싶은 말을 적어보세요..."
                        className="flex-1 font-serif text-sm leading-relaxed bg-transparent resize-none outline-none placeholder:text-gray-300"
                    />
                    <div className="text-right mt-4 text-xs text-gray-400 font-handwriting text-lg">
                        {new Date().toLocaleDateString()}
                    </div>
                </div>
            </main>
        </div>
    );
}
