# packages/shared-types — 공유 타입 가이드

## 역할

FE/BE 공용 DTO, Enum, 인터페이스의 **단일 소스**. 빌드 없이 소스 직접 참조 방식.

## 변경 시 규칙

1. 타입 변경 후 반드시 `pnpm type-check`로 FE/BE 양쪽 검증
2. re-export 시 `export type { ... }` 사용 (isolatedModules 대응)

```typescript
// O: 올바른 re-export
export type { CreatePostDto, PostResponseDto } from './post.dto';

// X: isolatedModules 에러
export { CreatePostDto, PostResponseDto } from './post.dto';
```

## 구조

```
src/
  enums/    → Role, Visibility, InvitationStatus, MembershipStatus 등
  dto/      → 각 도메인별 요청/응답 DTO (interface)
  interfaces/ → ApiResponse<T>, PaginatedResponse<T>
  index.ts  → 전체 re-export
```
