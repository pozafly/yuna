'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import BottomNav from '../../components/BottomNav';
import SideNav from '../../components/SideNav';
import BabySelector from '../../components/BabySelector';
import BrandMark from '../../components/BrandMark';
import Button from '../../components/Button';
import Noah from '../../components/Noah';
import June from '../../components/June';
import Sticker from '../../components/Sticker';
import Doodle from '../../components/Doodle';

interface BabyInfo {
  id: string;
  name: string;
  role: string;
  birthDate?: string | null;
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
        <div className="animate-bounce-soft">
          <BrandMark size={48} color="#DDA9F3" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen">
      {/* 전체 앱 컨테이너 — 데스크탑에서 사이드바+콘텐츠를 중앙 정렬 */}
      <div className="bg-pure-light lg:max-w-[900px] lg:mx-auto lg:flex lg:min-h-screen lg:shadow-[0_0_60px_rgba(0,0,0,0.03)]">
        {/* 데스크탑 사이드 네비게이션 (lg 이상에서만 표시) */}
        <SideNav
          babies={user.babies}
          selectedBaby={selectedBaby}
          onSelectBaby={setSelectedBaby}
        />

        {/* 콘텐츠 영역 */}
        <div className="flex-1 min-w-0">
        {/* 모바일 상단 헤더 (데스크탑에서는 SideNav가 대체) */}
        <header className="sticky top-0 z-10 bg-pure-light/80 backdrop-blur-sm border-b border-inkroot/5 px-4 py-3 lg:hidden relative">
          {/* 중앙 브랜드마크 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <BrandMark size={24} color="#339833" />
          </div>
          <div className="flex items-center justify-between">
            <h1 className="font-handwrite text-xl text-inkroot">
              yuna&apos;s day
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
          className="px-4 py-4 pb-24 lg:px-6 lg:py-5 lg:pb-6"
          data-baby-id={selectedBaby?.id ?? ''}
          data-baby-role={selectedBaby?.role ?? ''}
          data-baby-name={selectedBaby?.name ?? ''}
          data-baby-birth-date={selectedBaby?.birthDate ?? ''}
          data-user-id={user.id}
          data-user-name={user.name}
        >
          {selectedBaby ? (
            children
          ) : (
            <div className="text-center py-16 space-y-5">
              {/* Noah + June 나란히 */}
              <div className="flex items-end justify-center gap-4">
                <Noah size={100} className="animate-bounce-soft" />
                <June size={100} className="animate-bounce-soft [animation-delay:0.3s]" />
              </div>
              <div className="flex justify-center">
                <Sticker text="baby" popIn />
              </div>
              <div className="flex justify-center gap-3">
                <Doodle type="sparkle" size={20} color="var(--color-petal-bloom)" />
                <Doodle type="heart" size={18} color="var(--color-blush-berry)" />
                <Doodle type="star" size={20} color="var(--color-sunbeam-pop)" />
              </div>
              <p className="display-tagline text-inkroot/80">환영합니다!</p>
              <p className="text-inkroot/50 text-sm">
                첫 번째 Baby를 등록하고 소중한 순간을 기록해보세요.
              </p>
              <Button
                variant="primary"
                onClick={() => router.push('/settings')}
              >
                Baby 등록하기
              </Button>
            </div>
          )}
        </main>
        </div>
      </div>

      {/* 모바일 하단 네비게이션 (lg 이상에서는 숨김) */}
      <BottomNav />
    </div>
  );
}
