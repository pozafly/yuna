# TECH-E: FE/BE 계약 (공유 타입·DTO·버전 관리 원칙)

> **문서 상태**: 1차 확정 (2026-02-27)

---

## 1. 공유 타입 패키지: `packages/shared-types`

### 1-1. 목적

- FE(`apps/web`)와 BE(`apps/api`)가 **동일한 타입 정의**를 사용하여 API 계약 불일치를 방지한다.
- DTO, Enum, 인터페이스를 단일 소스(single source of truth)에서 관리한다.

### 1-2. 패키지 구조

```
packages/shared-types/
├── src/
│   ├── enums/
│   │   ├── role.enum.ts          # Role.OWNER | Role.INVITED
│   │   ├── visibility.enum.ts    # Visibility.PRIVATE | Visibility.INVITED
│   │   ├── invitation-status.enum.ts  # PENDING | ACCEPTED | EXPIRED | CANCELLED
│   │   ├── membership-status.enum.ts  # ACTIVE | BLOCKED | WITHDRAWN
│   │   ├── baby-status.enum.ts        # ACTIVE | DELETED
│   │   └── index.ts
│   │
│   ├── dto/
│   │   ├── baby.dto.ts           # CreateBabyDto, BabyResponseDto
│   │   ├── post.dto.ts           # CreatePostDto, PostResponseDto
│   │   ├── letter.dto.ts         # CreateLetterDto, LetterResponseDto
│   │   ├── comment.dto.ts        # CreateCommentDto, CommentResponseDto
│   │   ├── invitation.dto.ts     # CreateInvitationDto, InvitationResponseDto
│   │   ├── auth.dto.ts           # MagicLinkRequestDto, LoginResponseDto
│   │   ├── notification.dto.ts   # NotificationResponseDto
│   │   └── index.ts
│   │
│   ├── interfaces/
│   │   ├── api-response.interface.ts  # 공통 API 응답 래퍼
│   │   ├── pagination.interface.ts    # 페이지네이션 인터페이스
│   │   └── index.ts
│   │
│   └── index.ts                  # 배럴 export (최종 진입점)
│
├── tsconfig.json                 # packages/tsconfig/base.json 상속
└── package.json                  # name: "@yuna/shared-types"
```

### 1-3. 패키지 이름 및 의존성 선언

```json
{
  "name": "@yuna/shared-types",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts"
}
```

> **빌드 없이 소스 직접 참조**: 모노레포 내에서는 `main`을 소스 파일로 지정하고, 빌드 없이 바로 import 한다. TypeScript path resolution으로 해결.

### 1-4. 의존자 측의 사용법

```json
// apps/api/package.json 또는 apps/web/package.json
{
  "dependencies": {
    "@yuna/shared-types": "workspace:*"
  }
}
```

```typescript
// apps/api/src/post/post.controller.ts
import { CreatePostDto, Visibility } from '@yuna/shared-types';
```

---

## 2. Enum 정의 (확정)

### 2-1. Role

```typescript
export enum Role {
  OWNER = 'OWNER',
  INVITED = 'INVITED',
}
```

### 2-2. Visibility

```typescript
export enum Visibility {
  PRIVATE = 'PRIVATE',
  INVITED = 'INVITED',
}
```

### 2-3. InvitationStatus

```typescript
export enum InvitationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}
```

### 2-4. MembershipStatus

```typescript
export enum MembershipStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  WITHDRAWN = 'WITHDRAWN',
}
```

### 2-5. BabyStatus

```typescript
export enum BabyStatus {
  ACTIVE = 'ACTIVE',
  DELETED = 'DELETED',
}
```

---

## 3. 공통 API 응답 래퍼

```typescript
// 단일 응답
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// 페이지네이션 응답
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalCount: number;
    totalPages: number;
  };
}
```

---

## 4. DTO 작성 규칙

| 규칙 | 설명 |
|------|------|
| 순수 타입만 | 런타임 의존성 없음. `class-validator`, `class-transformer` 등은 BE에서 별도 적용 |
| `interface` 또는 `type` 사용 | BE에서 `class`로 변환하여 사용 가능 |
| Request / Response 분리 | `Create*Dto`(요청), `*ResponseDto`(응답) 분리 |
| Optional 속성 표시 | `?` 기호로 명시 |
| Enum 참조만 허용 | Enum은 `enums/`에서 정의, DTO에서는 import 사용 |

### 예시: PostDto

```typescript
import { Visibility } from '../enums';

// FE → BE 요청
export interface CreatePostDto {
  babyId: string;
  content: string;
  visibility: Visibility;
  takenAt?: string; // ISO 8601
}

// BE → FE 응답
export interface PostResponseDto {
  id: string;
  babyId: string;
  authorId: string;
  authorName: string;
  content: string;
  visibility: Visibility;
  takenAt: string | null;
  mediaUrls: string[];     // presigned URLs (만료 시간 포함)
  commentCount: number;
  createdAt: string;        // ISO 8601
  updatedAt: string;        // ISO 8601
}
```

---

## 5. 버전 관리 원칙

| 항목 | 원칙 |
|------|------|
| 패키지 버전 | `0.0.0` 고정 (모노레포 내 워크스페이스 참조이므로 버전 무의미) |
| 의존성 참조 | `workspace:*` (항상 로컬 최신 소스 참조) |
| 타입 변경 시 | **FE와 BE 동시에 수정** — 타입이 단일 소스이므로 한쪽만 변경 불가 |
| Breaking Change | `shared-types` 수정 후 `pnpm type-check`로 양쪽 빌드 검증 |
| CI 검증 | `turbo type-check`를 CI에서 수행하여 타입 불일치 방지 |

---

## 6. Workspace Boundary 규칙

```
✅ 허용:
  apps/web   → packages/shared-types
  apps/api   → packages/shared-types
  apps/web   → packages/ui
  apps/api   → packages/* (config류)

❌ 금지:
  packages/* → apps/*         (역방향 의존 금지)
  apps/web   → apps/api       (직접 코드 참조 금지, HTTP API만 허용)
  apps/api   → apps/web       (역방향 금지)
```

---

## 7. API 엔드포인트 계약 (개요)

| Method | Endpoint | 요청 DTO | 응답 DTO | 참고 |
|--------|---------|---------|---------|------|
| POST | `/auth/magic-link` | `MagicLinkRequestDto` | `{ success }` | 매직링크 발송 |
| GET | `/auth/magic-link/verify` | query: `token` | `Set-Cookie` + redirect | 매직링크 검증 |
| GET | `/auth/google` | — | redirect → Google | Google OAuth 시작 |
| GET | `/auth/google/callback` | query: `code` | `Set-Cookie` + redirect | Google OAuth 콜백 |
| GET | `/auth/naver` | — | redirect → Naver | Naver OAuth 시작 |
| GET | `/auth/naver/callback` | query: `code` | `Set-Cookie` + redirect | Naver OAuth 콜백 |
| POST | `/invitations` | `CreateInvitationDto` | `InvitationResponseDto` | 초대 발송 |
| GET | `/auth/invite/verify` | query: `token` | redirect | 초대 수락 |
| POST | `/babies` | `CreateBabyDto` | `BabyResponseDto` | Baby 생성 |
| GET | `/babies/:id/posts` | query params | `PaginatedResponse<PostResponseDto>` | 피드 조회 |
| POST | `/posts` | `CreatePostDto` | `PostResponseDto` | 게시물 작성 |
| GET | `/posts/:id` | — | `PostResponseDto` | 게시물 상세 |
| POST | `/letters` | `CreateLetterDto` | `LetterResponseDto` | 편지 작성 |
| POST | `/comments` | `CreateCommentDto` | `CommentResponseDto` | 댓글 작성 |
| GET | `/notifications` | query params | `PaginatedResponse<NotificationResponseDto>` | 알림 조회 |

> 엔드포인트 상세 스펙(path params, query params, 에러 코드 등)은 구현 단계에서 확정한다.
