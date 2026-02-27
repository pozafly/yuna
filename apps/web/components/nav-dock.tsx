'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  symbol: string;
}

const ITEMS: NavItem[] = [
  { href: '/feed', label: '피드', symbol: 'F' },
  { href: '/letter', label: '편지', symbol: 'L' },
  { href: '/settings', label: '설정', symbol: 'S' }
];

export function NavDock() {
  const pathname = usePathname();

  return (
    <nav className="nav-dock" aria-label="주요 네비게이션">
      {ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-dock-item${isActive ? ' is-active' : ''}`}
          >
            <span className="symbol-badge" aria-hidden>
              {item.symbol}
            </span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
