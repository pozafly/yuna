# Yuna

Yuna는 아기 중심 폐쇄형 가족 SNS입니다.

## 개발 환경 시작

1. `pnpm install`
2. `cd infra && docker compose up -d`
3. `pnpm dev`

## 워크스페이스

- `apps/web`: Next.js 프론트엔드
- `apps/api`: NestJS 백엔드
- `packages/shared-types`: FE/BE 공유 타입
- `packages/tsconfig`: 공통 TS 설정
- `packages/eslint-config`: 공통 ESLint 설정
