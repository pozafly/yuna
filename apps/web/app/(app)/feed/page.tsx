import PostCard from '@/components/post-card';

// 데모 데이터
const DEMO_POSTS = [
    {
        id: 'post-1',
        authorName: '엄마',
        content: '유나의 첫 뒤집기 성공! 🎉\n어찌나 낑낑대던지, 마침내 해내고 활짝 웃는 모습이 천사 같아.',
        visibility: 'INVITED',
        takenAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        mediaUrls: [
            'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ]
    },
    {
        id: 'post-2',
        authorName: '아빠',
        content: '코~ 자는 유나 얼굴 훔쳐보기 👀\n우리 딸 언제 이렇게 컸지?',
        visibility: 'PRIVATE',
        takenAt: new Date(Date.now() - 86400000).toISOString(),
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        mediaUrls: [
            'https://images.unsplash.com/photo-1544126592-807ade215a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        ]
    }
];

export default function FeedPage() {
    return (
        <div className="min-h-screen bg-background">
            <header className="px-6 pt-12 pb-4 flex items-center justify-between sticky top-0 z-10 yuna-glass">
                <h1 className="font-heading text-2xl font-bold">
                    유나의 하루
                </h1>
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-handwriting text-primary text-xl shadow-sm">
                    Y
                </div>
            </header>

            <div className="px-4 pt-4">
                {DEMO_POSTS.map(post => (
                    <PostCard
                        key={post.id}
                        {...post}
                    />
                ))}

                <div className="text-center py-8 text-gray-400 text-sm">
                    모든 게시물을 다 보셨어요!
                </div>
            </div>
        </div>
    );
}
