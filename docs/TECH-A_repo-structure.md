# TECH-A: 리포지토리 구조 문서

> **문서 상태**: 1차 확정 (2026-02-27)
> **전략**: Monorepo — pnpm workspaces

---

## 1. 모노레포 전략

| 항목 | 결정 |
|------|------|
| 패키지 매니저 | **pnpm** (workspace 프로토콜 지원, 디스크 효율) |
| 레포 타입 | **Monorepo** (단일 Git 레포, 멀티 패키지) |
| 빌드 오케스트레이션 | **Turborepo** (태스크 캐싱, 의존성 그래프 기반 병렬 실행) |

---

## 2. 디렉토리 구조 (전체)

```
yuna/                                     # 리포지토리 루트
│
├── apps/                                 # 실행 가능한 애플리케이션
│   ├── web/                              # [FE] Next.js App Router + TypeScript
│   │   ├── app/                          # App Router 라우트 디렉토리
│   │   │   ├── (auth)/                   # 인증 관련 페이지 그룹
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── invite/[token]/page.tsx
│   │   │   ├── (app)/                    # 인증 필요 페이지 그룹
│   │   │   │   ├── feed/page.tsx
│   │   │   │   ├── letter/page.tsx
│   │   │   │   └── settings/page.tsx
│   │   │   └── layout.tsx
│   │   ├── components/                   # 웹 전용 컴포넌트
│   │   ├── lib/                          # 클라이언트 유틸 (API 클라이언트 등)
│   │   ├── public/
│   │   ├── .env.local                    # FE 전용 환경변수 (NEXT_PUBLIC_* 포함)
│   │   ├── next.config.ts
│   │   ├── tsconfig.json                 # packages/tsconfig 참조
│   │   └── package.json
│   │
│   └── api/                              # [BE] NestJS + TypeScript
│       ├── src/
│       │   ├── main.ts                   # 앱 진입점
│       │   ├── app.module.ts
│       │   ├── auth/                     # 인증 모듈 (매직링크, OAuth, 세션)
│       │   ├── baby/                     # Baby CRUD, 접근 제어
│       │   ├── invitation/               # 초대 생성/검증/수락
│       │   ├── post/                     # Post + PostMedia CRUD
│       │   ├── letter/                   # Letter CRUD
│       │   ├── comment/                  # Comment CRUD
│       │   ├── notification/             # 알림 발송
│       │   ├── storage/                  # MinIO 연동 (presigned URL 발급)
│       │   └── common/                   # 가드, 데코레이터, 미들웨어, 필터
│       ├── .env                          # BE 전용 환경변수
│       ├── tsconfig.json                 # packages/tsconfig 참조
│       └── package.json
│
├── packages/                             # 공유 라이브러리 (앱 간 공통)
│   ├── shared-types/                     # DTO, Enum, 인터페이스 공유
│   │   ├── src/
│   │   │   ├── enums/
│   │   │   │   ├── role.enum.ts          # OWNER | INVITED
│   │   │   │   └── visibility.enum.ts    # PRIVATE | INVITED
│   │   │   ├── dto/
│   │   │   │   ├── post.dto.ts
│   │   │   │   ├── letter.dto.ts
│   │   │   │   ├── comment.dto.ts
│   │   │   │   ├── invitation.dto.ts
│   │   │   │   └── baby.dto.ts
│   │   │   └── index.ts                  # 배럴 export
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── tsconfig/                         # 공통 TypeScript 설정
│   │   ├── base.json                     # 공통 compilerOptions
│   │   ├── nextjs.json                   # Next.js 전용 확장
│   │   ├── nestjs.json                   # NestJS 전용 확장
│   │   └── package.json
│   │
│   ├── eslint-config/                    # 공통 ESLint 설정
│   │   ├── base.js                       # 공통 룰셋
│   │   ├── nextjs.js
│   │   ├── nestjs.js
│   │   └── package.json
│   │
│   └── ui/                              # (선택) 공유 UI 컴포넌트
│       ├── src/
│       ├── tsconfig.json
│       └── package.json
│
├── infra/                                # 인프라 설정
│   ├── docker-compose.yml               # 로컬 개발 환경 (PG + MinIO)
│   ├── docker-compose.override.yml      # 로컬 개발 오버라이드 (선택)
│   └── minio/
│       └── init-buckets.sh              # 버킷 초기화 스크립트
│
├── docs/                                 # 프로젝트 문서
│   ├── README.md                        # 문서 인덱스
│   ├── PRD-A_summary.md
│   ├── PRD-B_permission-matrix.md
│   ├── PRD-C_screens-and-userflow.md
│   ├── PRD-D_data-entities.md
│   ├── TECH-A_repo-structure.md         # 이 문서
│   ├── TECH-B_auth-flow.md
│   ├── TECH-C_docker-compose.md
│   ├── TECH-D_minio-policy.md
│   └── TECH-E_fe-be-contract.md
│
├── .env.example                          # 루트 공통 환경변수 템플릿
├── .gitignore
├── .antigravityrules
├── pnpm-workspace.yaml                   # pnpm 워크스페이스 선언
├── turbo.json                            # Turborepo 태스크 파이프라인
├── package.json                          # 루트 package.json (루트 스크립트)
└── README.md                             # 레포 루트 README
```

---

## 3. 핵심 디렉토리 역할 요약

| 경로 | 역할 | 독립 빌드 |
|-----|------|:--------:|
| `apps/web` | Next.js 프론트엔드 — 라우팅, UI, API 호출 | ✅ |
| `apps/api` | NestJS 백엔드 — 비즈니스 로직, DB, 스토리지, 인증 | ✅ |
| `packages/shared-types` | DTO·Enum 단일 소스 — FE/BE 모두 import | ✅ |
| `packages/tsconfig` | TypeScript 설정 상속 루트 | ✅ |
| `packages/eslint-config` | ESLint 룰셋 공유 | ✅ |
| `packages/ui` | 재사용 UI 컴포넌트 (선택, 추후 활성화) | ✅ |
| `infra/` | Docker Compose, 초기화 스크립트 | — |
| `docs/` | 기획·기술 스펙 문서 | — |

---

## 4. pnpm Workspace 선언 (`pnpm-workspace.yaml`)

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

---

## 5. Turborepo 태스크 파이프라인 (`turbo.json` 개요)

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "outputs": ["coverage/**"],
      "dependsOn": ["^build"]
    },
    "type-check": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

---

## 6. 루트 스크립트 (`package.json` 개요)

| 스크립트 | 실행 내용 |
|---------|---------|
| `pnpm dev` | Turborepo로 web + api 동시 dev 실행 |
| `pnpm build` | 전체 빌드 (의존성 그래프 순서 자동 결정) |
| `pnpm lint` | 전체 workspace lint |
| `pnpm test` | 전체 workspace 테스트 |
| `pnpm type-check` | 전체 TypeScript 타입 검사 |

---

## 7. Workspace Boundary 원칙

1. `apps/*` → `packages/*` 의존 **허용**
2. `packages/*` → `apps/*` 의존 **금지** (단방향 의존성)
3. `apps/web` → `apps/api` 직접 코드 참조 **금지** (HTTP API 통신만 허용)
4. `packages/shared-types`는 순수 타입/인터페이스만 포함 (런타임 의존성 최소화)
