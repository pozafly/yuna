# Yuna's Day - UI 디자인 가이드라인

[Noah & June 비핸스 레퍼런스](https://www.behance.net/gallery/232296613/Noah-June?tracking_source=search_projects|baby&l=9)를 바탕으로 "Yuna's Day" 프론트엔드에 적용할 디자인 가이드라인입니다.

---

## 1. 전반적인 분위기 (Aesthetic Identity)

- **느낌:** 장난스럽고 부드러우며 유기적이면서도, 세련되고 현대적인 느낌.
- **테마:** 아이 중심의 브랜드 느낌을 주지만, 부모에게도 환영받을 수 있는 세련됨.
- **핵심 키워드:** 따뜻함(Warm), 정직함(Honest), 부드러움(Soft), 자연스러움(Natural), 장난스러움(Playful)
- **핵심 요소:**
  - 손그림 느낌의 낙서 스티커 (알록달록한 말풍선/배지형 텍스트)
  - 매우 둥글고 두툼한 모서리 (chunky corners)
  - 강렬한 포인트 색상과 부드러운 배경색의 대비
  - 소문자 위주의 친근한 타이포그래피
  - 자연에서 영감받은 장식 요소 (꽃, 나비, 풀밭)

---

## 2. 브랜드 심볼 시스템

### 2-1. 로고타입
- **스타일:** 소문자 손글씨(handwritten) 스타일
- **특징:** 따뜻하고, 개인적이며, 친근한 느낌. 소문자로 통일하여 부드럽고 아이 중심적인 톤 유지.
- **"&" 기호:** 연결과 유대감을 상징 (Noah와 June, 부모와 아이)
- **적용:** 패키지, 라벨, 웹사이트 헤더 등 전반에 일관 사용

### 2-2. 브랜드 마크 (릴리 플라워)
- **모티브:** 백합꽃 — 부드럽고, 열려있고, 자연적인 형태
- **상단 형태:** 자연의 왕관 (Crowned by Nature) — 꽃잎이 왕관처럼 펼쳐진 모양
- **하단 형태:** 물방울 — 순수함과 본질을 상징 (The Essence of Bloom)
- **의미:** 부드러운 돌봄, 성장, 평온의 상징
- **사용:** 앱 아이콘, 네비게이션 헤더 중앙, 파비콘

### 2-3. 캐릭터 마스코트
- **Noah (강아지):** 크림/베이지 톤의 단순하고 귀여운 강아지. 사랑, 편안함, 가족의 상징.
- **June (고양이):** 크림/베이지 톤의 단순하고 귀여운 고양이. Noah와 짝을 이루는 캐릭터.
- **그리기 스타일:** 최소한의 디테일, 부드러운 선, 밝은 크림색 채색. 손으로 그린 듯한 유기적 느낌.
- **용도:** 빈 상태(empty state) 일러스트, 온보딩 화면, 로딩 애니메이션, 장식 요소

### 2-4. 스티커 시스템
콘텐츠에 장난스러움과 깊이감을 더하는 떠다니는 말풍선/배지형 텍스트 요소.

| 스티커 텍스트 | 색상 | 용도 |
|-------------|------|------|
| `cute` | Sky Whisper (#B6D3FD) 배경 | 사진/카드 장식 |
| `baby` | Blush Berry (#FF6666) 배경 | 아기 관련 콘텐츠 강조 |
| `hi!` | 흰색 배경 + 검정 텍스트 | 인사/환영 맥락 |
| `wow` | Blush Berry (#FF6666) 배경 | 감탄/반응 표현 |
| `yoo!` | Petal Bloom (#DDA9F3) 배경 | 장난스러운 인사 |
| `noah` | Soft Dawn (#F1F1D2) 배경 | 강아지 캐릭터 라벨 |
| `june` | Fresh Stem (#339833) 배경 (클로버형) | 고양이 캐릭터 라벨 |

**스티커 스타일 CSS:**
```css
.sticker {
  display: inline-block;
  padding: 0.4rem 1rem;
  border-radius: 9999px;        /* 완전한 알약 형태 */
  font-family: 'Caveat', cursive;
  font-size: 1.1rem;
  font-weight: 700;
  transform: rotate(-5deg);     /* 살짝 기울어진 자연스러움 */
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
```

---

## 3. 색상 팔레트 (Color Palette)

배경을 위한 부드러운 파스텔 톤과 인터랙티브/장식 요소를 위한 생동감 있는 포인트 컬러의 조화.

### 3-1. 핵심 배경 색상 (Core Backgrounds)

| 이름 | HEX | 용도 | Tailwind 변수명 |
|------|------|------|----------------|
| **Petal Bloom** | `#DDA9F3` | 메인 히어로, 핵심 섹션 배경 | `--color-petal` |
| **Soft Dawn** | `#F1F1D2` | 카드 배경, 텍스트 읽기 영역, 제품 상세 | `--color-dawn` |
| **Inkroot** | `#000000` | 대비 강조, 스토리텔링 섹션, 로고타입 배경 | `--color-ink` |
| **Pure Light** | `#FFFFFF` | 앱 인터페이스, 카드 내부, 모달 | `--color-light` |

### 3-2. 생동감 있는 포인트 색상 (Vibrant Accents)

| 이름 | HEX | 용도 | Tailwind 변수명 |
|------|------|------|----------------|
| **Fresh Stem** | `#339833` | CTA 버튼, 성공 상태, 자연/성장 메타포 | `--color-stem` |
| **Blush Berry** | `#FF6666` | 좋아요/하트, 알림 뱃지, 따뜻한 강조 | `--color-berry` |
| **Sky Whisper** | `#B6D3FD` | 정보 배지, 차분한 강조, 하늘/평화 메타포 | `--color-sky` |
| **Amber Spark** | `#FD7700` | 긴급 알림, 장난스러운 강조 | `--color-amber` |
| **Sunbeam Pop** | `#F9F946` | 하이라이트, 새 기능 뱃지, 밝은 장식 | `--color-sunbeam` |

### 3-3. 색상 조합 규칙

```
배경 대비 원칙:
  Petal Bloom (#DDA9F3) 위 → Inkroot 텍스트 또는 Pure Light 텍스트
  Soft Dawn (#F1F1D2) 위   → Inkroot 텍스트
  Inkroot (#000000) 위      → Pure Light 텍스트 또는 포인트 색상 텍스트
  Pure Light (#FFFFFF) 위   → Inkroot 텍스트

배경색 교차 패턴 (세로 스크롤):
  Petal Bloom → Soft Dawn → Inkroot → Soft Dawn → Petal Bloom (반복)
```

### 3-4. Tailwind CSS 설정

```typescript
// tailwind.config.ts
const colors = {
  petal: '#DDA9F3',
  dawn: '#F1F1D2',
  ink: '#000000',
  light: '#FFFFFF',
  stem: '#339833',
  berry: '#FF6666',
  sky: '#B6D3FD',
  amber: '#FD7700',
  sunbeam: '#F9F946',
};
```

---

## 4. 타이포그래피 (Typography)

우아하고 가독성 높은 텍스트와 장난스러운 손글씨 포인트의 다층적 조합.

### 4-1. 폰트 패밀리 구성

| 용도 | 폰트 | 대체 폰트 | 설명 |
|------|------|----------|------|
| **디스플레이 (Hero)** | *Playfair Display* Bold | *Lora* Bold | 크고 굵은 장식적 세리프. 히어로 타이틀 전용. |
| **태그라인 (Tagline)** | *Playfair Display* Italic | *Lora* Italic | 우아한 이탤릭 세리프. 브랜드 슬로건, 감성 메시지. |
| **본문 (Body)** | *Inter* | *Outfit* | 깔끔한 산세리프. UI 텍스트, 설명, 메뉴. |
| **손글씨 (Handwritten)** | *Caveat* | *Kalam* | 스티커 텍스트, 장난스러운 포인트, 로고타입 스타일. |
| **섹션 라벨 (Label)** | *Inter* (Uppercase, letter-spacing: 0.3em) | — | 소제목 라벨. 대문자 + 넓은 자간. |

### 4-2. 타이포그래피 스케일

```css
/* 디스플레이 - 히어로 타이틀 */
.display-hero {
  font-family: 'Playfair Display', serif;
  font-weight: 900;
  font-size: clamp(3rem, 8vw, 6rem);
  line-height: 1.0;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

/* 태그라인 - 브랜드 슬로건 */
.display-tagline {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-weight: 400;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  line-height: 1.3;
}

/* 섹션 라벨 */
.section-label {
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: currentColor;
  opacity: 0.7;
}

/* 본문 */
.body-text {
  font-family: 'Inter', sans-serif;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.6;
}

/* 손글씨 포인트 */
.handwritten {
  font-family: 'Caveat', cursive;
  font-weight: 700;
  font-size: 1.25rem;
}
```

### 4-3. 타이포그래피 사용 규칙

1. **소문자 우선:** 로고, 태그라인, UI 요소는 가능한 소문자 사용 → 친근하고 부드러운 톤
2. **대문자 사용처:** 히어로 디스플레이 타이틀, 섹션 라벨에만 제한적 사용
3. **이탤릭 활용:** 감성적 메시지나 브랜드 슬로건에 이탤릭 세리프 적극 활용
4. **믹스 금지:** 한 문장 안에서 세리프와 산세리프를 혼용하지 않음 (스티커 텍스트 예외)

---

## 5. UI 컴포넌트 및 형태 (UI Components & Shapes)

### 5-1. 카드 및 컨테이너

```css
.card {
  border-radius: 2rem;           /* 매우 큰 둥근 모서리 — 핵심 디자인 요소 */
  background: var(--color-light);
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
}

.card-image {
  border-radius: 2rem;           /* 이미지도 동일한 radius */
  object-fit: cover;
}
```

- **절대 규칙:** 날카로운 모서리(직각) 없음. 최소 `border-radius: 1rem`, 기본 `2rem`.
- **이미지 프레임:** 이미지 자체에도 큰 둥근 모서리 적용.

### 5-2. 버튼

```css
/* Primary 버튼 — 알약(Pill) 형태 */
.btn-primary {
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  background: var(--color-stem);  /* Fresh Stem 기본 */
  color: var(--color-light);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(51, 152, 51, 0.3);
}

/* Secondary 버튼 — 아웃라인 알약 */
.btn-secondary {
  padding: 0.75rem 2rem;
  border-radius: 9999px;
  background: transparent;
  color: var(--color-ink);
  border: 2px solid var(--color-ink);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
}

/* 작은 태그 버튼 */
.btn-tag {
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  background: var(--color-dawn);
  color: var(--color-ink);
  font-size: 0.75rem;
}
```

### 5-3. 네비게이션

**모바일 헤더:**
```
┌──────────────────────────────────────┐
│  ☰          🌸 (브랜드마크)        🛒  │
└──────────────────────────────────────┘
```
- 왼쪽: 햄버거 메뉴
- 중앙: 릴리 플라워 브랜드 마크
- 오른쪽: 장바구니/알림 아이콘
- 배경: 투명 또는 반투명 (`backdrop-filter: blur(12px)`)

**하단 네비게이션 (모바일):**
```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0.75rem 1rem;
  padding-bottom: env(safe-area-inset-bottom);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-around;
  border-radius: 1.5rem 1.5rem 0 0;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.65rem;
  color: var(--color-ink);
  opacity: 0.5;
}
.bottom-nav-item.active {
  opacity: 1;
  color: var(--color-stem);
}
```

**하단 네비게이션 아이콘:**
- 각 아이콘은 둥근 사각형(squircle) 안에 배치
- 활성 탭: Fresh Stem 색상
- 비활성 탭: Inkroot 50% 투명도

### 5-4. 떠 있는 장식 요소 (Floating Decorations)

```css
/* 카드/이미지 위에 겹쳐지는 스티커 */
.floating-sticker {
  position: absolute;
  z-index: 10;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0) rotate(-3deg); }
  50% { transform: translateY(-6px) rotate(3deg); }
}

/* 장식용 낙서 요소 (별, 물결선, 하트 등) */
.doodle {
  position: absolute;
  opacity: 0.6;
  pointer-events: none;
}
```

- **배치 규칙:** 의도적인 비대칭. 이미지/카드의 모서리 바깥으로 살짝 삐져나오도록 배치.
- **회전:** 각 스티커마다 `-15deg ~ 15deg` 범위에서 랜덤 회전.
- **크기:** 부모 컨테이너의 15~25% 크기.

### 5-5. 제품 상세 / 포스트 카드

```css
.product-card {
  border-radius: 2rem;
  background: var(--color-light);
  overflow: hidden;
}

/* 색상 스와치 (원형) */
.color-swatch {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
}
.color-swatch.selected {
  border-color: var(--color-ink);
  box-shadow: 0 0 0 2px var(--color-light), 0 0 0 4px var(--color-ink);
}

/* 가격 표시 */
.price-tag {
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  border: 2px solid var(--color-ink);
  font-family: 'Inter', sans-serif;
  font-weight: 700;
}

/* ADD TO CART 버튼 */
.btn-cart {
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  background: var(--color-ink);
  color: var(--color-light);
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
}
```

### 5-6. 카테고리 메뉴 (드로어/모달)

```css
.category-menu {
  background: var(--color-dawn);
  border-radius: 2rem;
  padding: 2rem;
  text-align: center;
}

.category-menu-item {
  font-family: 'Playfair Display', serif;
  font-style: italic;
  font-size: 1.1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  color: var(--color-ink);
}
```

---

## 6. 레이아웃 패턴 (Layout Patterns)

### 6-1. 풀 위드스 색상 블록

세로 스크롤 시 배경색이 섹션 단위로 통째로 교차되는 구조.

```
┌──────────────────────────────────┐
│      Petal Bloom (#DDA9F3)       │  ← 히어로 / 핵심 메시지
├──────────────────────────────────┤
│       Soft Dawn (#F1F1D2)        │  ← 본문, 스토리, 상세 정보
├──────────────────────────────────┤
│       Inkroot (#000000)          │  ← 임팩트 강조, 대비 섹션
├──────────────────────────────────┤
│       Soft Dawn (#F1F1D2)        │  ← 다시 밝은 톤으로 전환
├──────────────────────────────────┤
│      Petal Bloom (#DDA9F3)       │  ← 감성적 마무리
└──────────────────────────────────┘
```

### 6-2. 50/50 분할 레이아웃

한 섹션을 좌우 반반으로 나누어 서로 다른 배경색이나 콘텐츠 유형 배치.

```
┌─────────────────┬─────────────────┐
│  Soft Dawn       │  Petal Bloom    │
│  (텍스트/스토리)  │  (텍스트/슬로건) │
│                  │                 │
│  일러스트 + 스티커 │  브랜드 메시지    │
└─────────────────┴─────────────────┘

┌─────────────────┬─────────────────┐
│  Inkroot         │  Soft Dawn      │
│  (로고타입 표시)   │  (브랜드마크)    │
│  LOGO TYPE 라벨  │  BRAND MARK 라벨 │
│  설명 텍스트      │  설명 텍스트     │
└─────────────────┴─────────────────┘
```

### 6-3. 섹션 라벨 패턴

각 섹션 상단에 소형 대문자 라벨을 배치하여 맥락 제공.

```
  BRAND MISSION              ← 섹션 라벨 (uppercase, letter-spacing: 0.3em)
                              ← 여백 (1.5rem)
  To create safe, beautiful  ← 메인 콘텐츠 (이탤릭 세리프)
  essentials for little ones
```

### 6-4. 중앙 집중형 미니멀리즘

```css
.hero-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 6rem 2rem;
  min-height: 60vh;
}
```

- 텍스트나 핵심 메시지를 화면 중앙에 배치
- 상하좌우 넉넉한 여백 (`padding: 4rem ~ 8rem`)
- 주변에 스티커/낙서 요소를 비대칭으로 흩뿌림

### 6-5. 사진 + 스티커 오버레이

```
┌────────────────────────────┐
│                     [wow!] │  ← 스티커가 사진 위에 겹침
│      (아이 사진)     [june]│
│                            │
│  [hi!]                     │
│            [noah]  [baby]  │
└────────────────────────────┘
```

- 사진 위에 스티커 요소를 `position: absolute`로 배치
- 사진 프레임: `border-radius: 2rem`
- 스티커: 사진 경계를 약간 넘어가도록 배치하여 깊이감 연출

---

## 7. 모션 및 인터랙션 (Motion & Interaction)

### 7-1. 기본 원칙
- **부드러움 우선:** 모든 전환은 `ease-out` 또는 `ease-in-out`
- **속도:** 기본 200ms, 페이지 전환 300ms, 장식 애니메이션 2~4초 루프
- **과하지 않게:** 사용자 액션에 대한 피드백은 미세하게, 장식 애니메이션은 느리고 자연스럽게

### 7-2. 주요 모션

```css
/* 카드 호버 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-out;
}

/* 버튼 탭 피드백 */
.btn:active {
  transform: scale(0.97);
  transition: transform 0.1s ease-out;
}

/* 스티커 등장 */
@keyframes sticker-pop {
  0% { transform: scale(0) rotate(-20deg); opacity: 0; }
  70% { transform: scale(1.1) rotate(3deg); opacity: 1; }
  100% { transform: scale(1) rotate(-2deg); opacity: 1; }
}

/* 페이지 진입 */
@keyframes fade-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 8. 아이콘 및 일러스트 스타일 (Iconography)

### 8-1. UI 아이콘
- **스타일:** 2px 두께의 라인 아이콘 (Lucide, Phosphor 등)
- **크기:** 기본 24px, 소형 20px, 대형 32px
- **색상:** Inkroot 기본, 활성 상태에서 Fresh Stem

### 8-2. 장식 일러스트
- **스타일:** 손으로 그린 듯한 낙서 느낌 (doodle style)
- **요소 목록:**
  - 별/반짝임 (✦, ✧)
  - 물결선/곡선
  - 하트
  - 파티 모자 (삼각형)
  - 화살표
  - 작은 꽃
  - 나비 (흰색, 풀밭 배경 위에 흩뿌림)
- **색상:** 포인트 색상 사용 또는 Inkroot 단색
- **투명도:** 장식 요소는 50~70% 투명도로 은은하게

---

## 9. 반응형 전략 (Responsive)

### 9-1. 브레이크포인트

| 이름 | 너비 | 레이아웃 |
|------|------|---------|
| Mobile | `< 640px` | 단일 컬럼, 하단 네비게이션 |
| Tablet | `640px ~ 1024px` | 2컬럼 그리드 |
| Desktop | `> 1024px` | 최대 너비 `1280px` 중앙 정렬, 사이드 네비게이션 |

### 9-2. 모바일 우선 규칙
- 50/50 분할 레이아웃 → 모바일에서 세로 스택
- 히어로 타이틀 크기: `clamp(2.5rem, 8vw, 6rem)`
- 스티커 크기: 모바일에서 70% 축소
- 패딩: 모바일 `1.5rem`, 데스크톱 `4rem ~ 8rem`

---

## 10. 사진 및 이미지 스타일 (Photography)

### 10-1. 사진 톤
- **조명:** 따뜻하고 자연스러운 조명 (골든아워 느낌)
- **배경:** 자연(풀밭, 정원) 또는 깨끗한 단색 배경
- **피사체:** 아이의 자연스러운 표정 (웃음, 놀라움 등 진정성 있는 감정)
- **색감:** 따뜻한 톤 보정, 과도한 채도 지양

### 10-2. 이미지 프레임 규칙

```css
.photo-frame {
  border-radius: 2rem;
  overflow: hidden;
  position: relative;  /* 스티커 오버레이를 위해 */
}

/* 자연 배경 (풀밭) 섹션 */
.nature-bg {
  background-image: url('/textures/grass.jpg');
  background-size: cover;
  position: relative;
}
.nature-bg::after {
  /* 흰 나비 패턴 오버레이 */
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/butterflies.svg');
  background-repeat: repeat;
  opacity: 0.3;
  pointer-events: none;
}
```

---

## 11. 패키지/인쇄물 스타일 (참고용)

웹에서도 적용 가능한 패키지 디자인 패턴:

- **기본 배경:** Soft Dawn (#F1F1D2) — 따뜻하고 자연스러운 크래프트지 느낌
- **메인 카피:** 이탤릭 세리프로 감성적 문구 ("Every product tells a love story")
- **브랜드 마크:** 상단 또는 중앙에 릴리 플라워 배치
- **스티커 장식:** 모서리에 2~3개 스티커 배치하여 장난스러움 추가
- **URL 표시:** 하단에 작은 산세리프로 `noahandjune.com` 스타일

---

## 12. 빠른 참조 — 핵심 CSS 변수

```css
:root {
  /* 배경 색상 */
  --color-petal: #DDA9F3;
  --color-dawn: #F1F1D2;
  --color-ink: #000000;
  --color-light: #FFFFFF;

  /* 포인트 색상 */
  --color-stem: #339833;
  --color-berry: #FF6666;
  --color-sky: #B6D3FD;
  --color-amber: #FD7700;
  --color-sunbeam: #F9F946;

  /* 둥근 모서리 */
  --radius-sm: 1rem;
  --radius-md: 1.5rem;
  --radius-lg: 2rem;
  --radius-full: 9999px;

  /* 폰트 */
  --font-display: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
  --font-hand: 'Caveat', cursive;

  /* 그림자 */
  --shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 24px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.12);

  /* 전환 */
  --transition-fast: 150ms ease-out;
  --transition-base: 200ms ease-out;
  --transition-slow: 300ms ease-in-out;
}
```
