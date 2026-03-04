'use client';

/**
 * 하단 네비게이션 독(Dock) 컴포넌트
 *
 * 디자인 가이드:
 * - 유리 질감 효과 (backdrop-filter: blur)
 * - 화면에 떠 있는 트렌디한 독(Dock) 형태
 * - 세 가지 탭: Feed, Letter, Settings
 * - 데스크탑(lg 이상)에서는 SideNav가 대체하므로 숨김 처리
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';

export default function BottomNav() {
  const pathname = usePathname();

  return (
    // 고정 하단 배치, 좌우 여백으로 떠있는 독 효과
    // lg 이상에서는 SideNav를 사용하므로 숨김
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm pb-safe lg:hidden">
      <div className="glass-nav rounded-full px-2 py-2 flex items-center justify-around shadow-lg shadow-inkroot/10">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'flex flex-col items-center gap-0.5 px-5 py-2 rounded-full',
                'transition-all duration-200',
                isActive
                  ? 'text-fresh-stem bg-fresh-stem/10'
                  : 'text-inkroot/40 hover:text-inkroot/70',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-current={isActive ? 'page' : undefined}
            >
              {item.icon(isActive)}
              <span
                className={`text-xs font-semibold transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
