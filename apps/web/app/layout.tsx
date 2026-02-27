import type { Metadata } from 'next';
import { Inter, Playfair_Display, Caveat } from 'next/font/google';
import NavDock from '@/components/nav-dock';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const caveat = Caveat({
    subsets: ['latin'],
    variable: '--font-caveat',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Yuna - 우당탕탕 육아일기',
    description: '프라이빗 가족 앨범 & 타임캡슐 영사기',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko" className={`${inter.variable} ${playfair.variable} ${caveat.variable}`}>
            <body className="bg-background min-h-screen text-foreground font-sans antialiased">
                <main className="max-w-md mx-auto relative min-h-screen bg-white shadow-xl overflow-hidden pb-24">
                    {children}
                    <NavDock />
                </main>
            </body>
        </html>
    );
}
