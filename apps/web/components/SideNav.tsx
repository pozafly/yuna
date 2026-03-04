'use client';

/**
 * 데스크탑 전용 사이드 네비게이션 컴포넌트
 *
 * Instagram 웹처럼 왼쪽에 고정된 사이드바로 표시된다.
 * lg(1024px) 이상에서만 보이고, 모바일에서는 숨겨진다.
 * 상단에 로고, 중간에 네비게이션 링크, 하단에 Baby 선택기를 배치한다.
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { navItems } from './nav-items';
import BabySelector from './BabySelector';
import BrandMark from './BrandMark';

interface BabyInfo {
  id: string;
  name: string;
  role: string;
}

interface SideNavProps {
  babies: BabyInfo[];
  selectedBaby: BabyInfo | null;
  onSelectBaby: (baby: BabyInfo) => void;
}

export default function SideNav({
  babies,
  selectedBaby,
  onSelectBaby,
}: SideNavProps) {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex sticky top-0 h-screen w-[244px] shrink-0 flex-col bg-pure-light border-r border-inkroot/5">
      {/* 상단 로고: 릴리 플라워 브랜드마크 + 손글씨 */}
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <BrandMark size={28} color="#339833" />
        <h1 className="font-handwrite text-2xl text-inkroot">
          yuna&apos;s day
        </h1>
      </div>

      {/* 네비게이션 링크 */}
      <ul className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[
                  'flex items-center gap-4 px-4 py-3 rounded-2xl',
                  'transition-all duration-200',
                  isActive
                    ? 'bg-fresh-stem/10 text-fresh-stem font-semibold'
                    : 'text-inkroot/60 hover:bg-soft-dawn hover:text-inkroot',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon(isActive)}
                <span className="text-base">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 하단 Baby 선택기 */}
      {babies.length > 0 && (
        <div className="px-4 py-5 border-t border-inkroot/5">
          <BabySelector
            babies={babies}
            selected={selectedBaby}
            onSelect={onSelectBaby}
          />
        </div>
      )}
    </nav>
  );
}
