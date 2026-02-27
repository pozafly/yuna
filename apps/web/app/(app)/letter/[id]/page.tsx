import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const DEMO_LETTER = {
    id: '1',
    title: '유나가 세상에 온 날',
    content: '어떻게 너를 말로 다 설명할 수 있을까. 새벽 내내 진통을 겪고 마침내 너의 울음소리를 들었을 때 그 벅찬 감정을...\n\n엄마는 아직도 그 순간을 생각하면 가슴이 먹먹해져. 작고 따뜻했던 너를 처음 품에 안았을 때, 세상 그 어떤 보석보다 네가 더 소중했단다.\n\n앞으로 네가 커가면서 힘든 일도, 기쁜 일도 많겠지만 언제나 엄마 아빠가 네 곁에서 든든한 버팀목이 되어줄게. 건강하게만 자라다오. 사랑해 우리 딸.',
    authorName: '엄마',
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    visibility: 'INVITED',
};

export default function LetterDetailPage() {
    return (
        <div className="min-h-screen bg-[#FEFBF6] pb-24">
            <header className="px-4 h-14 flex items-center border-b border-[#F4EDE1] bg-[#FEFBF6]/80 backdrop-blur-md sticky top-0 z-10">
                <Link href="/letter" className="p-2 -ml-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
            </header>

            <main className="p-6 pt-8">
                <div className="yuna-card p-8 min-h-[60vh] flex flex-col shadow-md border border-[#F4EDE1] relative">

                    <div className="absolute top-6 right-6 w-14 h-16 bg-white shadow-sm border border-gray-100 flex items-center justify-center rotate-3">
                        <span className="text-2xl font-handwriting text-primary/40">Yuna</span>
                    </div>

                    <h1 className="font-heading text-2xl font-bold mb-6 pr-16 text-gray-800">
                        {DEMO_LETTER.title}
                    </h1>

                    <div className="flex-1">
                        <p className="font-serif text-gray-700 leading-[2.2] tracking-wide whitespace-pre-wrap">
                            {DEMO_LETTER.content}
                        </p>
                    </div>

                    <div className="mt-12 flex flex-col items-end border-t border-dashed border-gray-200 pt-6">
                        <div className="text-sm text-gray-400 mb-2">
                            {new Date(DEMO_LETTER.createdAt).toLocaleDateString()}
                        </div>
                        <div className="font-handwriting text-2xl text-primary font-bold">
                            From. {DEMO_LETTER.authorName}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
