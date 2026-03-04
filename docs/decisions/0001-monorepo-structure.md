# 0001. 모노레포 구조 채택

- **상태**: Accepted
- **날짜**: 2026-02-25

## 배경

Yuna는 프론트엔드(Next.js)와 백엔드(NestJS)로 구성된 풀스택 애플리케이션이다.
두 앱이 DTO, Enum 등 공통 타입을 공유해야 하며, 개발 환경에서 동시에 실행/빌드해야 한다.

## 선택지

1. **멀티레포**: FE/BE를 별도 저장소로 분리하고, npm 패키지로 공통 타입을 배포
2. **모노레포 (pnpm workspaces + Turborepo)**: 단일 저장소에서 workspace로 패키지 분리

## 결정

**pnpm workspaces + Turborepo 모노레포**를 채택한다.

```
apps/web          → Next.js App Router (FE)
apps/api          → NestJS (BE)
packages/shared-types  → DTO·Enum 공유 타입
packages/tsconfig      → TypeScript 설정 공유
packages/eslint-config → ESLint 룰셋 공유
infra/            → Docker Compose (로컬 개발용)
```

## 결과

- `@yuna/shared-types`를 빌드 없이 소스 직접 참조 방식으로 사용 → 타입 변경이 즉시 양쪽에 반영
- `pnpm dev` 한 번으로 FE/BE 동시 실행
- `pnpm type-check`로 전체 타입 정합성 한 번에 검증
- Workspace 경계 규칙: `apps/*` → `packages/*` 허용, 역방향 금지
