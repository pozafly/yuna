import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: "Yuna's Day",
    template: "%s | Yuna's Day",
  },
  description:
    '소중한 아기의 매일을 가족과 함께 기록하는 폐쇄형 가족 SNS입니다.',
  // 외부 검색 엔진에 노출되지 않도록 설정 (폐쇄형 서비스)
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  // 모바일 화면에 최적화된 뷰포트 설정
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  // iOS Safari에서 상태바 영역을 컨텐츠 영역에 포함
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen relative">
          {children}
        </div>
      </body>
    </html>
  );
}
