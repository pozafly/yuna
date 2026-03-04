---
description: 칸반보드 아이템의 상태를 변경합니다
user-invocable: true
argument-hint: "<이슈번호 또는 제목> <todo | progress | done> [--label agent:이름]"
allowed-tools: Bash
---

GitHub Projects #4 "Yuna 칸반 보드"의 아이템 상태를 변경합니다.

인수: $ARGUMENTS (예: "#12 progress --label agent:backend", "로그인 기능 done")

## 프로젝트 상수

- **Owner**: pozafly
- **프로젝트 번호**: 4
- **프로젝트 ID**: PVT_kwHOA4rMj84BQt8q
- **Status 필드 ID**: PVTSSF_lAHOA4rMj84BQt8qzg-wcbM
- **Status 옵션 ID**:
  - Todo: `f75ad846`
  - In Progress: `47fc9ee4`
  - Done: `98236657`

## 실행 방법

1. `$ARGUMENTS`에서 대상과 상태를 파싱한다:
   - 마지막 단어가 `todo`, `progress`, `done` 중 하나이면 그것이 상태
   - 나머지 부분이 이슈번호(#N) 또는 검색 키워드

2. 칸반 아이템 목록 조회:
   ```bash
   gh project item-list 4 --owner pozafly --format json
   ```

3. 대상 아이템을 찾는다:
   - `#N` 형태이면 이슈 번호로 매칭
   - 텍스트이면 제목에서 키워드 검색

4. 상태를 매핑한다:
   - `todo` → `f75ad846`
   - `progress` → `47fc9ee4`
   - `done` → `98236657`

5. 상태 변경:
   ```bash
   gh project item-edit --project-id PVT_kwHOA4rMj84BQt8q --id <아이템ID> --field-id PVTSSF_lAHOA4rMj84BQt8qzg-wcbM --single-select-option-id <옵션ID>
   ```

6. `--label` 옵션이 있으면 이슈에 라벨 추가:
   ```bash
   gh issue edit <이슈번호> --repo pozafly/yuna --add-label "<라벨명>"
   ```
   사용 가능한 에이전트 라벨: `agent:pm`, `agent:backend`, `agent:frontend`, `agent:architecture`, `agent:qa`, `agent:designer`

7. 완료 보고:
   - 변경된 아이템 제목
   - 이전 상태 → 새 상태
   - 추가된 라벨 (있는 경우)

## 주의사항

- 대상 아이템을 찾지 못하면 유사한 제목의 아이템 목록을 보여주고 사용자에게 확인한다.
- 여러 아이템이 매칭되면 목록을 보여주고 사용자에게 선택을 요청한다.
- 이미 같은 상태인 경우 "이미 해당 상태입니다"라고 보고한다.
