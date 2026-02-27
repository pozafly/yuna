---
name: Codebase Search & Analysis
description: 모노레포 구조 전반의 의존성, 인터페이스 및 하드코딩 탐지
---
# Codebase Search & Analysis 스킬

**목적:** Yuna 프로젝트의 복잡한 모노레포(`apps/web`, `apps/api`, `packages/shared-types`) 사이클에서 타입이나 설정의 불일치가 없는지 전역 탐색하고 정돈합니다.

**사용 시점:**
- 새로운 API 컨트롤러를 만들거나 기존 엔드포인트를 변경할 때 연관된 FE 코드를 찾을 때
- `packages/shared-types`를 사용하지 않고 FE/BE에서 임의로(hard-coded) 만든 인터페이스를 색출하고자 할 때
- 프로젝트 트리(`tree`) 수준에서 모듈 간 의존성 파악이 필요할 때

**사용 방법 (가이드):**
- 대상 식별자(예: 인터페이스명, 변수명)로 전역 `grep_search` 또는 `codebase_search` (의미론적 검색)를 수행하여 참조된 위치를 파악합니다.
- 분석된 결과를 바탕으로 변경 영향도를 산정하고 리팩토링 범위를 먼저 결정한 뒤 코드를 수정합니다.
