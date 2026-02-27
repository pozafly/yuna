---
name: File Editor & Document Writer
description: 마크다운 문서, 설정 파일(JSON/YAML/ENV), 공유 타입 파일의 생성 및 수정
---
# File Editor & Document Writer 스킬

**목적:** Yuna 프로젝트의 기획 문서(`docs/`), 공유 타입(`packages/shared-types`), 인프라 설정(`infra/`)을 정확하게 생성하고 수정합니다.

**사용 시점:**
- `docs/PRD-*.md`, `docs/TECH-*.md` 문서를 신규 작성하거나 업데이트할 때
- `packages/shared-types/src` 내 DTO, Enum, Interface 파일을 추가·수정할 때
- `.env.example`, `docker-compose.yml` 등 인프라 설정 파일을 변경할 때

**사용 방법 (가이드):**
- 파일을 수정하기 전 반드시 현재 내용을 열람(`view_file`)하여 기존 구조를 파악한 뒤 최소 변경 원칙으로 편집합니다.
- `packages/shared-types/src/index.ts`에서 export가 누락되지 않도록 항상 마지막에 확인합니다.
- 문서 작성 시 기존 PRD 파일의 서식(헤더 레벨, 섹션 구조)을 통일하여 일관성을 유지합니다.
