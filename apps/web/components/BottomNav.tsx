'use client';

/**
 * 하단 네비게이션 독(Dock) 컴포넌트
 *
 * 디자인 가이드:
 * - 유리 질감 효과 (backdrop-filter: blur)
 * - 화면에 떠 있는 트렌디한 독(Dock) 형태
 * - 세 가지 탭: Feed, Letter, Settings
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
}

// 피드 아이콘 (카메라/사진)
function FeedIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 transition-all duration-200 ${active ? 'scale-110' : ''}`}
      fill={active ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
      />
    </svg>
  );
}

// 편지 아이콘 (봉투)
function LetterIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 transition-all duration-200 ${active ? 'scale-110' : ''}`}
      fill={active ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  );
}

// 설정 아이콘 (기어)
function SettingsIcon({ active }: { active: boolean }) {
  return (
    <svg
      className={`w-6 h-6 transition-all duration-200 ${active ? 'scale-110' : ''}`}
      fill={active ? 'currentColor' : 'none'}
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={active ? 0 : 1.8}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

const navItems: NavItem[] = [
  {
    href: '/feed',
    label: '피드',
    icon: (active) => <FeedIcon active={active} />,
  },
  {
    href: '/letter',
    label: '편지',
    icon: (active) => <LetterIcon active={active} />,
  },
  {
    href: '/settings',
    label: '설정',
    icon: (active) => <SettingsIcon active={active} />,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    // 고정 하단 배치, 좌우 여백으로 떠있는 독 효과
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-sm pb-safe">
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
                  ? 'text-inkroot bg-petal-bloom'
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
