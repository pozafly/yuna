---
name: Terminal Command & Scripting
description: 로컬 인프라 (Docker, 모노레포 커맨드) 조작 및 백그라운드 테스트 수행
---
# Terminal Command & Scripting 스킬

**목적:** Yuna 프로젝트의 백엔드 개발 및 QA 에이전트가 로컬 개발 환경(PostgreSQL, MinIO 등)을 직접 제어하거나, 컴파일 및 테스트 명령어를 실행합니다.

**사용 시점:**
- 백엔드 개발 시 DB나 Storage 컨테이너를 올리고자 할 때 (`docker-compose up -d`)
- 새로운 모듈/기능 개발 후 전체 빌드 호환성이나 린트(Lint)를 확인할 때 (`pnpm build`, `pnpm lint`)
- E2E 타겟 스크립트 실행, 백그라운드 테스트 환경 구동(`pnpm test`) 시

**사용 방법 (가이드):**
- pnpm 기반 워크스페이스이므로, 루트 외의 특정 패키지 명령 실행 시 `--filter` 옵션을 사용하세요.
- 터미널 런타임 로그를 주기적으로 읽어 서버 실행 중의 예외 메시지(Exception Stacktrace)를 분석합니다.
