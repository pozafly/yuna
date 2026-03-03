'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import BottomNav from '../../components/BottomNav';
import SideNav from '../../components/SideNav';
import BabySelector from '../../components/BabySelector';

interface BabyInfo {
  id: string;
  name: string;
  role: string;
}

interface UserInfo {
  id: string;
  email: string;
  name: string;
  babies: BabyInfo[];
}

// 앱 전역에서 선택된 Baby를 관리하는 Context 대용 (간단 구현)
export interface AppContext {
  user: UserInfo;
  selectedBaby: BabyInfo | null;
  setSelectedBaby: (baby: BabyInfo) => void;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [selectedBaby, setSelectedBaby] = useState<BabyInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<{ data: UserInfo }>('/auth/me')
      .then((res) => {
        const userData = res.data;
        setUser(userData);
        if (userData.babies.length > 0) {
          setSelectedBaby(userData.babies[0]);
        }
      })
      .catch(() => {
        router.push('/login');
      })
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-bounce-soft text-4xl">
          <span role="img" aria-label="baby">
            👶
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-pure-light">
      {/* 데스크탑 사이드 네비게이션 (lg 이상에서만 표시) */}
      <SideNav
        babies={user.babies}
        selectedBaby={selectedBaby}
        onSelectBaby={setSelectedBaby}
      />

      {/* 콘텐츠 래퍼 — 데스크탑에서 사이드바 너비만큼 왼쪽 마진 */}
      <div className="lg:ml-[244px]">
        {/* 모바일 상단 헤더 (데스크탑에서는 SideNav가 대체) */}
        <header className="sticky top-0 z-10 bg-pure-light/80 backdrop-blur-sm border-b border-inkroot/5 px-4 py-3 lg:hidden">
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-xl font-bold text-inkroot">
              Yuna&apos;s Day
            </h1>
            {user.babies.length > 0 && (
              <BabySelector
                babies={user.babies}
                selected={selectedBaby}
                onSelect={setSelectedBaby}
              />
            )}
          </div>
        </header>

        {/* 메인 콘텐츠 — selectedBaby를 data attribute로 전달 */}
        <main
          className="px-4 py-4 pb-24 lg:pb-8 lg:max-w-[630px] lg:mx-auto"
          data-baby-id={selectedBaby?.id ?? ''}
          data-baby-role={selectedBaby?.role ?? ''}
          data-user-id={user.id}
          data-user-name={user.name}
        >
          {selectedBaby ? (
            children
          ) : (
            <div className="text-center py-16">
              <p className="text-inkroot/50 text-sm mb-4">
                아직 등록된 Baby가 없습니다.
              </p>
              <button
                onClick={() => router.push('/settings')}
                className="px-6 py-3 bg-petal-bloom text-inkroot font-semibold rounded-full hover:opacity-90 transition"
              >
                Baby 등록하기
              </button>
            </div>
          )}
        </main>
      </div>

      {/* 모바일 하단 네비게이션 (lg 이상에서는 숨김) */}
      <BottomNav />
    </div>
  );
}
