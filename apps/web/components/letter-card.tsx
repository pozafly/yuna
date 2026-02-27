import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface LetterCardProps {
    id: string;
    title: string;
    content: string;
    authorName: string;
    createdAt: string;
    visibility: string;
}

export default function LetterCard({ id, title, content, authorName, createdAt, visibility }: LetterCardProps) {
    return (
        <div className="relative isolate mb-6">
            <div className="yuna-card p-6 bg-[#FEFBF6] border border-[#F4EDE1]">
                {/* 우표 모티브 데코레이션 */}
                <div className="absolute top-4 right-4 w-12 h-14 bg-white shadow-sm border border-gray-100 flex items-center justify-center -rotate-6">
                    <span className="text-xl font-handwriting text-primary/40">Yuna</span>
                </div>

                <div className="mb-4 pr-16">
                    <h3 className="font-heading text-xl font-bold mb-1 line-clamp-2">{title}</h3>
                    <div className="text-xs text-gray-400 flex items-center gap-2">
                        <span>To. 미래의 유나에게</span>
                        {visibility === 'PRIVATE' && (
                            <span className="bg-gray-100 text-gray-500 px-2 py-[1px] rounded-full">나만 보기</span>
                        )}
                    </div>
                </div>

                <p className="font-serif text-sm text-gray-600 line-clamp-3 leading-relaxed mb-6">
                    {content}
                </p>

                <div className="flex justify-between items-end">
                    <div className="text-xs text-gray-400">
                        {format(new Date(createdAt), 'yyyy.MM.dd', { locale: ko })}
                    </div>
                    <div className="font-handwriting text-lg text-primary">
                        From. {authorName}
                    </div>
                </div>
            </div>
        </div>
    );
}
