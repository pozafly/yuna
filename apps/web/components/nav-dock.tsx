'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Mail, PlusCircle, Settings } from 'lucide-react';

export default function NavDock() {
    const pathname = usePathname();

    // /feed, /letter, /settings 경로 외에는 렌더링하지 않음 (로그인 등)
    if (!pathname || (!pathname.startsWith('/feed') && !pathname.startsWith('/letter') && !pathname.startsWith('/settings'))) {
        return null;
    }

    const isActive = (path: string) => pathname === path || (path !== '/feed' && pathname.startsWith(path));

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-[calc(28rem-3rem)] z-50">
            <nav className="yuna-glass rounded-[2rem] px-6 py-4 flex items-center justify-between shadow-lg">
                <Link
                    href="/feed"
                    className={`flex flex-col items-center gap-1 transition-all ${isActive('/feed') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Home className="w-6 h-6" strokeWidth={isActive('/feed') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">피드</span>
                </Link>

                <Link
                    href="/letter"
                    className={`flex flex-col items-center gap-1 transition-all ${isActive('/letter') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Mail className="w-6 h-6" strokeWidth={isActive('/letter') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">편지</span>
                </Link>

                <Link
                    href="/feed/new"
                    className="flex items-center justify-center -mt-8 bg-primary text-white w-14 h-14 rounded-full shadow-[0_4px_14px_0_rgba(255,176,176,0.5)] hover:-translate-y-1 transition-all"
                >
                    <PlusCircle className="w-8 h-8" />
                </Link>

                <Link
                    href="/settings"
                    className={`flex flex-col items-center gap-1 transition-all ${isActive('/settings') ? 'text-primary' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <Settings className="w-6 h-6" strokeWidth={isActive('/settings') ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">설정</span>
                </Link>
            </nav>
        </div>
    );
}
