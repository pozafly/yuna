import type { Metadata } from 'next';
import { Caveat, Outfit, Playfair_Display } from 'next/font/google';
import './globals.css';

const display = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['600', '700']
});

const body = Outfit({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '700']
});

const sticker = Caveat({
  subsets: ['latin'],
  variable: '--font-sticker',
  weight: ['700']
});

export const metadata: Metadata = {
  title: "Yuna's Day",
  description: '아기 중심 폐쇄형 가족 SNS'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${display.variable} ${body.variable} ${sticker.variable}`}
    >
      <body
        style={{
          fontFamily: 'var(--font-body), sans-serif'
        }}
      >
        {children}
      </body>
    </html>
  );
}
