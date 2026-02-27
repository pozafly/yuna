import LetterCard from '@/components/letter-card';

const DEMO_LETTERS = [
    {
        id: '1',
        title: '유나가 세상에 온 날',
        content: '어떻게 너를 말로 다 설명할 수 있을까. 새벽 내내 진통을 겪고 마침내 너의 울음소리를 들었을 때 그 벅찬 감정을.',
        authorName: '엄마',
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
        visibility: 'INVITED',
    },
    {
        id: '2',
        title: '첫 치아가 난 날 기념',
        content: '우연히 네 입안을 들여다보다가 하얗고 작은 치아 하나가 뿅 올라온 걸 발견했어! 어찌나 귀엽던지 엄마랑 한참을 웃었네.',
        authorName: '아빠',
        createdAt: new Date().toISOString(),
        visibility: 'PRIVATE',
    }
];

export default function LetterPage() {
    return (
        <div className="min-h-screen bg-background">
            <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-10 yuna-glass">
                <div>
                    <h1 className="font-heading text-2xl font-bold">
                        타임 캡슐
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">미래의 아이에게 보내는 편지</p>
                </div>
                <span className="text-2xl">💌</span>
            </header>

            <div className="px-6 pt-6">
                {DEMO_LETTERS.map(letter => (
                    <LetterCard
                        key={letter.id}
                        {...letter}
                    />
                ))}
            </div>
        </div>
    );
}
