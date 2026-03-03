# apps/web — FE 개발 가이드

## 빌드 & 실행

- `pnpm --filter web dev` — Next.js dev 서버 (포트 3001)
- `pnpm --filter web build` — 프로덕션 빌드
- `pnpm --filter web type-check` — tsc 타입 검사

## API 통신

`lib/api.ts`의 fetch 래퍼를 사용. 모든 요청에 `credentials: 'include'` 자동 적용.

### 응답 형식

BE의 TransformInterceptor가 `{ success, data }` 로 래핑하므로 **항상 `res.data`로 접근**:

```typescript
const res = await api.get<{ data: UserInfo }>('/auth/me');
const user = res.data; // ← 실제 데이터
```

### 401 자동 처리

401 응답 시 `/auth/refresh` 시도 → 실패 시 `/login`으로 리다이렉트.

## 설정 파일 주의사항

- `next.config.mjs` 사용 (Next.js 14는 `.ts` 미지원)
- `transpilePackages: ['@yuna/shared-types']` 필수

## 라우트 구조

```
(auth)/login/           → 로그인 (dev-login 버튼 포함)
(auth)/invite/[token]/  → 초대 수락
(app)/feed/             → 피드 목록
(app)/feed/new/         → 새 게시물 작성
(app)/feed/[postId]/    → 게시물 상세
(app)/letter/           → 편지 목록
(app)/letter/new/       → 새 편지 작성
(app)/letter/[letterId]/ → 편지 상세
(app)/settings/         → 설정
```

## 컨텍스트 전달 방식

`(app)/layout.tsx`에서 인증 후 `data-*` attribute로 babyId, role, userId를 `<main>`에 전달.
하위 페이지에서 `document.querySelector('main')?.dataset.babyId`로 접근.
