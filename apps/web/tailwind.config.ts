import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: 'var(--primary)',
                'coral-accent': 'var(--coral-accent)',
                'peach-accent': 'var(--peach-accent)',
                card: 'var(--card-bg)',
            },
            borderRadius: {
                'xl': '1rem',
                '2xl': '1.5rem',
                '3xl': '2rem',
                '4xl': '2.5rem', // Noah & June 디자인의 둥근 모서리
            },
            fontFamily: {
                serif: ['var(--font-playfair)'],
                sans: ['var(--font-inter)'],
                handwriting: ['var(--font-caveat)'],
            },
        }
    },
    plugins: [],
};
export default config;
