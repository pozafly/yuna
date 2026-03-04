import type { Config } from 'tailwindcss';

const config: Config = {
  // Tailwind가 스타일을 적용할 파일 경로 설정
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // --- 핵심 배경 색상 (Core Backgrounds) ---
        // Petal Bloom: 부드러운 라벤더/퍼플. 메인 히어로 섹션에 사용.
        'petal-bloom': '#DDA9F3',
        // Soft Dawn: 연한 베이지/카키. 텍스트 읽기 영역에 사용.
        'soft-dawn': '#F1F1D2',
        // Inkroot: 깊은 검정색. 대비 강조 섹션에 사용.
        inkroot: '#000000',
        // Pure Light: 순백색. 카드 배경과 앱 인터페이스에 사용.
        'pure-light': '#FFFFFF',

        // --- 생동감 있는 포인트 색상 (Vibrant Accents) ---
        // Fresh Stem: 생기 있는 초록색.
        'fresh-stem': '#339833',
        // Blush Berry: 따뜻한 빨강/핑크.
        'blush-berry': '#FF6666',
        // Sky Whisper: 부드러운 연하늘색.
        'sky-whisper': '#B6D3FD',
        // Amber Spark: 장난스러운 오렌지색.
        'amber-spark': '#FD7700',
        // Sunbeam Pop: 밝은 노란색.
        'sunbeam-pop': '#F9F946',
      },
      borderRadius: {
        // 디자인 가이드: 매우 큰 둥근 모서리 (2rem 이상)
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        // 디스플레이/히어로용 폰트 (Playfair Display)
        display: ['Playfair Display', 'Lora', 'Georgia', 'serif'],
        // 헤딩용 세리프 폰트
        serif: ['Lora', 'Georgia', 'serif'],
        // 본문 및 UI용 산세리프 폰트
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // 포인트 손글씨 폰트
        handwrite: ['Caveat', 'cursive'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-in-out',
        float: 'float 3s ease-in-out infinite',
        'sticker-pop': 'stickerPop 0.5s ease-out forwards',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(-3deg)' },
          '50%': { transform: 'translateY(-6px) rotate(3deg)' },
        },
        stickerPop: {
          '0%': { transform: 'scale(0) rotate(-20deg)', opacity: '0' },
          '70%': { transform: 'scale(1.1) rotate(3deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(-2deg)', opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        // 카드 기본 그림자 (레이어드)
        card: '0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.04)',
        // 카드 호버 그림자 (레이어드)
        'card-hover': '0 1px 0 rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.14), 0 24px 48px rgba(0,0,0,0.06)',
        // 스티커 그림자
        sticker: '0 2px 8px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        // 네비게이션 dock의 유리 질감 효과
        nav: '12px',
      },
    },
  },
  plugins: [],
};

export default config;
