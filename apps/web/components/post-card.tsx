'use client';

import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface PostCardProps {
    id: string;
    authorName: string;
    content: string;
    visibility: string;
    takenAt: string;
    mediaUrls: string[];
    createdAt: string;
}

export default function PostCard({ authorName, content, visibility, takenAt, mediaUrls, createdAt }: PostCardProps) {
    // 실제 날짜 혹은 생성 날짜 사용
    const displayDate = takenAt ? new Date(takenAt) : new Date(createdAt);

    return (
        <article className="yuna-card mb-6">
            {/* 카드 헤더 */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-peach-accent flex items-center justify-center text-primary font-bold">
                        {authorName[0]}
                    </div>
                    <div>
                        <div className="font-bold flex items-center gap-2">
                            {authorName}
                            {visibility === 'PRIVATE' && (
                                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-normal">
                                    나만 보기
                                </span>
                            )}
                        </div>
                        <div className="text-xs text-gray-400">
                            {format(displayDate, 'yyyy년 M월 d일', { locale: ko })}
                        </div>
                    </div>
                </div>
            </div>

            {/* 이미지 슬라이더 (여기서는 임시로 첫 번째 이미지만 렌더링) */}
            <div className="relative aspect-[4/5] bg-gray-100 w-full overflow-hidden">
                {mediaUrls && mediaUrls.length > 0 ? (
                    <img
                        src={mediaUrls[0]}
                        alt="아기 사진"
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        사진이 없습니다
                    </div>
                )}

                {/* 여러 장인 경우 인디케이터 */}
                {mediaUrls && mediaUrls.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                        1 / {mediaUrls.length}
                    </div>
                )}
            </div>

            {/* 본문 내용 */}
            <div className="p-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {content}
                </p>

                <div className="mt-4 pt-4 border-t border-gray-50 text-gray-400 text-sm flex gap-4">
                    <button className="flex items-center gap-1 hover:text-primary transition-colors">
                        <span>💬</span> 댓글 달기
                    </button>
                </div>
            </div>
        </article>
    );
}
