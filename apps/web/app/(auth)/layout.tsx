import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인',
};

/**
 * 인증 영역 레이아웃
 * 로그인, 초대 수락 페이지에 공통으로 적용되는 레이아웃이다.
 * Petal Bloom 배경에 중앙 정렬된 카드 형태로 구성된다.
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-petal-bloom flex flex-col items-center justify-center px-4 py-8 pt-safe">
      {/* 상단 브랜드 로고/텍스트 */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-4xl font-bold text-inkroot">
          Yuna&apos;s Day
        </h1>
        <p className="mt-2 font-handwrite text-lg text-inkroot/70">
          소중한 순간을 가족과 함께
        </p>
      </div>

      {/* 인증 컨텐츠 카드 — Root에서 제거된 max-w-md를 여기에 적용 */}
      <div className="w-full max-w-md bg-pure-light rounded-4xl shadow-lg p-8">
        {children}
      </div>

      {/* 하단 여백 */}
      <div className="pb-safe" />
    </div>
  );
}
