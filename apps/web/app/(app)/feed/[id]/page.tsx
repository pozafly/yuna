import PostCard from '@/components/post-card';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

// 데모 데이터 (피드 목록과 동일한 데이터 구조)
const DEMO_POST = {
    id: 'post-1',
    authorName: '엄마',
    content: '유나의 첫 뒤집기 성공! 🎉\n어찌나 낑낑대던지, 마침내 해내고 활짝 웃는 모습이 천사 같아.',
    visibility: 'INVITED',
    takenAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    mediaUrls: [
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    ]
};

export default function PostDetailPage() {
    return (
        <div className="min-h-screen bg-background pb-24">
            <header className="px-4 h-14 flex items-center border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <Link href="/feed" className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="font-heading font-bold text-lg ml-2">게시물 상세</h1>
            </header>

            <main className="pt-4 px-4 bg-background">
                <PostCard {...DEMO_POST} />

                {/* 댓글 섹션 */}
                <div className="mt-8">
                    <h2 className="font-bold text-gray-800 mb-4 px-2">댓글 1개</h2>

                    <div className="space-y-4 mb-6">
                        <div className="flex gap-3 items-start px-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-bold shrink-0">
                                아
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold text-sm">아빠</span>
                                    <span className="text-xs text-gray-400">방금 전</span>
                                </div>
                                <p className="text-sm text-gray-700 bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 inline-block">
                                    우리 딸 장하다!! 이따 퇴근하고 폭풍 뽀뽀해줘야지 😘
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 댓글 입력창 (하단 고정) */}
            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 p-4 pb-8 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="댓글을 남겨주세요..."
                        className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all border border-gray-100"
                    />
                    <button className="bg-primary text-white rounded-full px-4 text-sm font-medium hover:bg-coral-accent transition-colors">
                        등록
                    </button>
                </div>
            </div>
        </div>
    );
}
