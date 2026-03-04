import type { Metadata } from 'next';
import BrandMark from '../../components/BrandMark';
import Sticker from '../../components/Sticker';

export const metadata: Metadata = {
  title: '로그인',
};

/**
 * 인증 영역 레이아웃
 * 로그인, 초대 수락 페이지에 공통으로 적용되는 레이아웃이다.
 * Petal Bloom 배경에 중앙 정렬된 카드 형태로 구성된다.
 * 플로팅 스티커 장식이 배경에 표시된다 (sm 이상).
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden min-h-screen bg-petal-bloom flex flex-col items-center justify-center px-4 py-8 pt-safe">
      {/* 플로팅 스티커 장식 (sm 이상에서만 표시) */}
      <div className="hidden sm:block">
        <div className="floating-sticker top-[12%] left-[8%]">
          <Sticker text="cute" floating />
        </div>
        <div className="floating-sticker top-[25%] right-[6%]" style={{ animationDelay: '1s' }}>
          <Sticker text="wow" floating />
        </div>
        <div className="floating-sticker bottom-[15%] left-[12%]" style={{ animationDelay: '2s' }}>
          <Sticker text="yoo!" floating />
        </div>
      </div>

      {/* 상단 브랜드 로고: 릴리 플라워 + 손글씨 */}
      <div className="mb-8 text-center relative z-10">
        <div className="flex justify-center mb-3">
          <BrandMark size={48} color="#339833" />
        </div>
        <h1 className="font-handwrite text-4xl text-inkroot">
          yuna&apos;s day
        </h1>
        <p className="display-tagline mt-2 text-inkroot/70">
          소중한 순간을 가족과 함께
        </p>
      </div>

      {/* 인증 컨텐츠 카드 */}
      <div className="relative z-10 w-full max-w-md bg-pure-light rounded-4xl shadow-lg p-8">
        {children}
      </div>

      {/* 하단 여백 */}
      <div className="pb-safe" />
    </div>
  );
}
