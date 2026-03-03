# apps/api — BE 개발 가이드

## 빌드 & 실행

- `pnpm --filter api dev` — SWC watch 모드 실행 (포트 3000)
- `pnpm --filter api build` — 프로덕션 빌드
- `pnpm --filter api type-check` — tsc 타입 검사 (SWC와 별도)
- dev-login: `POST /auth/dev-login` (테스트 유저 `dev@yuna.app` 자동 생성)

## SWC 빌더 + TypeORM 엔티티 규칙

nest-cli.json에서 `"builder": "swc"` 사용 중. **엔티티 관계 작성 시 반드시 아래 패턴을 따를 것.**

### 올바른 패턴

```typescript
import type { User } from './user.entity'; // import type → 컴파일 시 제거

@ManyToOne('User', 'comments', { onDelete: 'CASCADE' }) // 문자열 기반
@JoinColumn({ name: 'author_id' })
author: User;
```

### 금지 패턴

```typescript
// X: 런타임 순환 참조 → Cannot access 'X' before initialization
import { User } from './user.entity';
@ManyToOne(() => User, (user) => user.comments)

// X: SWC 패닉 → Bad type for decorator: TsImportType
@ManyToOne('User', 'comments')
author: import('./user.entity').User;
```

## API 응답 형식

`TransformInterceptor` + `HttpExceptionFilter`가 main.ts에서 글로벌 등록됨.

- 성공: `{ "success": true, "data": { ... } }`
- 에러: `{ "success": false, "message": "...", "statusCode": 400 }`

## shared-types 참조

빌드 없이 소스 직접 참조. tsconfig에서:
- `paths`: `@yuna/shared-types` → `../../packages/shared-types/src`
- `include`에 shared-types 소스 경로 포함
- re-export 시 `export type { ... }` 사용 (isolatedModules 대응)
