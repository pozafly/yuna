---
description: GitHub 이슈를 생성하고 칸반보드에 등록합니다
user-invocable: true
argument-hint: "<이슈 제목>"
allowed-tools: Bash
---

GitHub 이슈를 생성하고 Projects #4 "Yuna 칸반 보드"에 Todo로 등록합니다.

인수: $ARGUMENTS (이슈 제목 또는 "제목 | 본문" 형태)

## 프로젝트 상수

- **Owner**: pozafly
- **Repo**: pozafly/yuna
- **프로젝트 번호**: 4
- **프로젝트 ID**: PVT_kwHOA4rMj84BQt8q
- **Status 필드 ID**: PVTSSF_lAHOA4rMj84BQt8qzg-wcbM
- **Status 옵션 ID**:
  - Backlog: `ce826b28`
  - Todo: `53ebecb1`
  - In Progress: `c9ef38fc`
  - Done: `b32d9a8c`

## 실행 방법

1. `$ARGUMENTS`에서 제목과 본문을 파싱한다:
   - `|`가 있으면: 앞부분 = 제목, 뒷부분 = 본문
   - `|`가 없으면: 전체를 제목으로 사용

2. 이슈 생성:
   ```bash
   gh issue create --repo pozafly/yuna --title "<제목>" --body "<본문>"
   ```

3. 생성된 이슈를 프로젝트에 추가:
   ```bash
   gh project item-add 4 --owner pozafly --url <이슈 URL>
   ```

4. 추가된 아이템의 ID를 조회:
   ```bash
   gh project item-list 4 --owner pozafly --format json
   ```
   결과에서 방금 추가한 이슈의 아이템 ID를 찾는다.

5. 상태를 Todo로 설정:
   ```bash
   gh project item-edit --project-id PVT_kwHOA4rMj84BQt8q --id <아이템ID> --field-id PVTSSF_lAHOA4rMj84BQt8qzg-wcbM --single-select-option-id 53ebecb1
   ```

6. 완료 보고:
   - 생성된 이슈 번호와 URL
   - 칸반보드 등록 상태 (Todo)

## 주의사항

- 제목이 비어있으면 사용자에게 제목 입력을 요청한다.
- 이슈 생성 실패 시 에러 메시지를 보고한다.
- 라벨이 필요하면 사용자에게 확인 후 `--label` 옵션을 추가한다.
