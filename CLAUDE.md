# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 기본 규칙

- 모든 대답은 **한국어**로 한다.
- 코드 수정 시 기존 스타일(Prettier 설정)을 반드시 따른다.
- 새로운 라이브러리를 설치할 때는 반드시 사용자 허락을 구한다.
- 주석은 친절하고 구체적으로 작성한다.

---

## 개발 환경 실행

### 1단계: 인프라 실행 (PostgreSQL + MinIO)

```bash
cd infra
docker compose up -d
```

### 2단계: 의존성 설치 및 앱 실행

```bash
# 루트에서 전체 의존성 설치
pnpm install

# 전체 개발 서버 동시 실행 (권장)
pnpm dev

# 또는 개별 실행
pnpm --filter api dev   # NestJS (포트 3000)
pnpm --filter web dev   # Next.js (포트 3001)
```

### 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm build` | 전체 빌드 (의존성 그래프 순서 자동 결정) |
| `pnpm lint` | 전체 workspace lint |
| `pnpm test` | 전체 테스트 |
| `pnpm type-check` | 전체 TypeScript 타입 검사 |
| `pnpm --filter web <cmd>` | FE 패키지 단독 명령 |
| `pnpm --filter api <cmd>` | BE 패키지 단독 명령 |

### 환경변수

- `apps/api/.env` — BE 환경변수 (DB, MinIO, JWT, OAuth, Mail 등)
- `apps/web/.env.local` — FE 환경변수 (`NEXT_PUBLIC_API_URL`)
- `.env.example` — 루트 공통 환경변수 템플릿 참고

---

## 아키텍처 개요

**Yuna**는 아기 중심 폐쇄형 가족 SNS 서비스로, pnpm + Turborepo 기반 **모노레포** 구조이다.

### 패키지 구성

```
apps/web       → Next.js App Router (FE, 포트 3001)
apps/api       → NestJS (BE, 포트 3000)
packages/shared-types → DTO·Enum 단일 소스 (FE/BE 공용)
packages/tsconfig     → TypeScript 설정 상속 루트
packages/eslint-config → ESLint 룰셋 공유
infra/         → Docker Compose (PG + MinIO 로컬 개발 전용)
docs/          → PRD 및 기술 스펙 문서
.agents/       → AI 에이전트 정의 (skills/, workflows/)
```

### Workspace 의존성 규칙

- `apps/*` → `packages/*` 의존 **허용**
- `packages/*` → `apps/*` 의존 **금지**
- `apps/web` → `apps/api` 직접 코드 참조 **금지** (HTTP API 통신만 허용)

### 공유 타입 사용법

`packages/shared-types`는 빌드 없이 소스 직접 참조 방식이다.

```typescript
import { CreatePostDto, Visibility, Role } from '@yuna/shared-types';
```

타입 변경 시 **FE와 BE를 동시에 수정**해야 한다. 변경 후 반드시 `pnpm type-check`로 검증한다.

---

## 핵심 도메인 개념

### 역할 (Role)

| 역할 | 설명 |
|------|------|
| `OWNER` | Baby를 생성·관리하는 사람. 공동 OWNER 허용. |
| `INVITED` | OWNER로부터 이메일 초대를 받고 승인한 가족 구성원 |

### Visibility

- `PRIVATE` — OWNER만 볼 수 있음
- `INVITED` — 해당 Baby에 초대된 모든 구성원이 볼 수 있음

### 핵심 원칙 (절대 위반 금지)

1. **폐쇄형** — OWNER 초대 없이 접근 불가 (초대 없는 가입 불가)
2. **외부 공유 차단** — 인증·권한 없이 링크·이미지 직접 접근 불가
3. **서버 최종 권한 판단** — 프론트엔드 숨김은 보안 수단이 아님
4. **다운로드 버튼 미제공** (Baby 삭제 후 30일 아카이브 다운로드 예외)

---

## 인증 아키텍처

- **세션 방식**: HttpOnly Cookie (Access Token 15분, Refresh Token 30일)
- **localStorage JWT 저장 금지**
- **로그인 방법**: 매직링크 이메일 / Google OAuth / Naver OAuth
- **계정 통합**: 동일 이메일 → 단일 계정 (Provider 무관)
- **최초 가입**: 이메일 초대(매직링크)를 통해서만 가능

### BE 인증 가드 체크 순서

1. Cookie에서 accessToken 추출 및 서명 검증
2. `User.status = ACTIVE` 확인
3. `BabyMembership.status = ACTIVE` 확인
4. visibility 권한 확인 (`PRIVATE` → OWNER만)
5. `Baby.status = ACTIVE` 확인 (삭제된 Baby 차단)

---

## BE 모듈 구조 (`apps/api/src/`)

| 모듈 | 역할 |
|------|------|
| `auth/` | 매직링크, OAuth, 세션 관리 |
| `baby/` | Baby CRUD, 접근 제어 |
| `invitation/` | 초대 생성/검증/수락 |
| `post/` | Post + PostMedia CRUD |
| `letter/` | Letter CRUD (타임캡슐) |
| `comment/` | Comment CRUD |
| `notification/` | 알림 발송 |
| `storage/` | MinIO presigned URL 발급 |
| `common/` | 가드, 데코레이터, 미들웨어, 필터 |

---

## FE 라우트 구조 (`apps/web/app/`)

```
(auth)/login/           → 로그인 페이지
(auth)/invite/[token]/  → 초대 수락 페이지
(app)/feed/             → 피드 (인증 필요)
(app)/letter/           → 편지/타임캡슐 (인증 필요)
(app)/settings/         → 설정 (인증 필요)
```

---

## 로컬 인프라 포트

| 서비스 | 포트 |
|--------|------|
| PostgreSQL | 5432 |
| MinIO API | 9000 |
| MinIO Console | 9001 (`minio_admin` / `minio_secret`) |
| NestJS API | 3000 |
| Next.js Web | 3001 |

> `docker compose down -v`는 볼륨까지 삭제하므로 주의.
