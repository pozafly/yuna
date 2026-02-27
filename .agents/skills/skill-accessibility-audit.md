---
name: Accessibility & Performance Audit
description: Lighthouse 기반 접근성·성능·SEO 점검 및 WCAG 준수 확인
---
# Accessibility & Performance Audit 스킬

**목적:** Yuna 프로젝트의 웹 UI가 접근성(Accessibility), 성능(Performance), SEO 기본 사항을 충족하는지 Lighthouse 등의 도구로 점검하고, 개선 포인트를 구체적으로 도출합니다.

**사용 시점:**
- 신규 페이지/컴포넌트 개발 완료 후 접근성 점수를 확인할 때
- 이미지 최적화, 폰트 로딩, 렌더링 성능 등 Core Web Vitals를 측정할 때
- `alt` 속성 누락, 색상 대비 부족, 키보드 네비게이션 불가 등 접근성 이슈를 탐지할 때
- 배포 전 최종 품질 게이트(Quality Gate)로 성능 기준치 이상을 확인할 때

**사용 방법 (가이드):**
- 브라우저 개발자 도구(DevTools)의 Lighthouse 탭 또는 `npx lighthouse <URL> --output=json` CLI를 활용합니다.
- 점검 결과에서 접근성(Accessibility) 항목을 우선 확인하고, 심각도가 높은 이슈(Critical/Serious)부터 수정 가이드를 작성합니다.
- 성능 점수는 모바일 기준으로 측정하며, LCP·FID·CLS 지표를 중심으로 분석합니다.
