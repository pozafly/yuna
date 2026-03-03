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
