# 0004. Noah & June 디자인 시스템

- **상태**: Accepted
- **날짜**: 2026-03-03

## 배경

Yuna는 아기 중심 가족 SNS로, 일반적인 SaaS/대시보드 스타일이 아닌 따뜻하고 감성적인 UI가 필요하다.
초기 구현에서 기본 Tailwind 스타일을 적용했으나, "디자인이 너무 구리다"는 피드백을 받았다.

## 선택지

1. **기존 UI 라이브러리 (shadcn/ui 등)**: 빠르지만 차가운 느낌
2. **커스텀 디자인 시스템**: 브랜드에 맞는 고유한 스타일, 개발 비용 높음

## 결정

**"Noah & June"** 이름의 커스텀 디자인 시스템을 채택한다.

### 핵심 원칙

- 둥근 모서리 (`border-radius: 2rem` 이상)
- 스티커/낙서(Doodle) 장식 요소
- 파스텔 색상 팔레트 중심

### 색상 팔레트

| 이름 | 코드 | 용도 |
|------|------|------|
| Petal Bloom | `#DDA9F3` | 메인 히어로 배경 (라벤더) |
| Soft Dawn | `#F1F1D2` | 앱 배경, 텍스트 영역 |
| Inkroot | `#000000` | 대비 강조 |
| Pure Light | `#FFFFFF` | 카드 배경 |
| Fresh Stem | `#339833` | 포인트 (초록) |
| Blush Berry | `#FF6666` | 포인트 (핑크/좋아요) |
| Sky Whisper | `#B6D3FD` | 포인트 (하늘) |
| Amber Spark | `#FD7700` | 포인트 (주황) |
| Sunbeam Pop | `#F9F946` | 포인트 (노랑) |

### 타이포그래피

- **Display**: Playfair Display (제목, 감성적 텍스트)
- **Body**: Inter (본문)
- **Handwriting**: Caveat (낙서, 장식 텍스트)

### 그림자 (레이어드)

```
card: 0 1px 0 rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.08), 0 12px 32px rgba(0,0,0,0.04)
card-hover: 0 1px 0 rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.14), 0 24px 48px rgba(0,0,0,0.06)
```

## 결과

- 앱 배경을 Soft Dawn(`#F1F1D2`)으로 변경하여 카드 깊이감 확보
- Doodle 장식 opacity를 30~50%로 높여 존재감 부여
- 역할 배지를 한국어화 (OWNER→부모, INVITED→가족)
- 편지 카드에 색상 띠, 이탤릭 제목, 우표 스타일 날짜 배지 등 감성 요소 추가
