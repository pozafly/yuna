---
description: shared-types 변경 후 FE/BE 양쪽의 타입 호환성을 검증합니다
user-invocable: true
allowed-tools: Bash, Read, Grep
---

`packages/shared-types` 변경 후 전체 워크스페이스의 타입 호환성을 검증합니다.

## 실행 절차

1. `packages/shared-types/src/index.ts`의 배럴 export 확인
2. `pnpm type-check` 실행하여 전체 타입 검사
3. 타입 에러 발생 시:
   - 에러 위치(파일:라인)와 에러 메시지 정리
   - FE(`apps/web`)와 BE(`apps/api`) 중 어디서 발생했는지 분류
   - 수정 방향 제안
4. `pnpm lint` 실행하여 린트 검사
5. 결과 요약 보고
