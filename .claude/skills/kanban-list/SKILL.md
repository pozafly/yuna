---
description: GitHub Projects 칸반보드의 아이템 목록을 조회합니다
user-invocable: true
argument-hint: "[todo | progress | done | all]"
allowed-tools: Bash
---

GitHub Projects #4 "Yuna 칸반 보드"의 아이템을 조회합니다.

인수: $ARGUMENTS (기본값: all)

## 프로젝트 상수

- **Owner**: pozafly
- **프로젝트 번호**: 4

## 실행 방법

1. 전체 아이템 조회:
   ```bash
   gh project item-list 4 --owner pozafly --format json
   ```

2. 결과를 파싱하여 상태별로 분류한다:
   - `$ARGUMENTS`가 `todo`이면 Status가 "Todo"인 아이템만 표시
   - `$ARGUMENTS`가 `progress`이면 Status가 "In Progress"인 아이템만 표시
   - `$ARGUMENTS`가 `done`이면 Status가 "Done"인 아이템만 표시
   - `$ARGUMENTS`가 `all`이거나 비어있으면 전체 표시

3. 결과를 아래 형태의 마크다운 표로 정리한다:

   | # | 제목 | 상태 | 담당 | 이슈 번호 |
   |---|------|------|------|-----------|

4. 마지막에 상태별 개수 요약을 추가한다:
   ```
   요약: Todo N개 / In Progress N개 / Done N개 / 전체 N개
   ```

## 주의사항

- JSON 파싱 시 `items` 배열에서 `title`, `status`, `assignees` 필드를 추출한다.
- 아이템이 없으면 "칸반보드에 등록된 아이템이 없습니다"라고 보고한다.
