---
description: 전체 모노레포의 빌드, 타입 체크, 린트, 테스트를 한번에 실행합니다
user-invocable: true
allowed-tools: Bash
---

전체 모노레포의 품질 게이트를 순차적으로 실행합니다.

## 실행 순서

1. **타입 체크**: `pnpm type-check`
2. **린트**: `pnpm lint`
3. **빌드**: `pnpm build`
4. **테스트**: `pnpm test`

각 단계의 성공/실패를 기록하고, 실패한 단계가 있으면 에러 내용을 상세히 보고합니다.
실패한 단계 이후의 나머지 단계도 계속 실행하여 전체 상태를 파악합니다.
