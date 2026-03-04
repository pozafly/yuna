# 0003. 칸반보드 Epic-Story-Task 계층 구조

- **상태**: Accepted
- **날짜**: 2026-03-04

## 배경

초기에는 모든 이슈가 동일 레벨로 칸반에 등록되어, 큰 기능과 세부 작업이 뒤섞여 전체 진행 상황을 파악하기 어려웠다.
"인스타그램 스타일 피드"처럼 여러 Story와 Task로 쪼개지는 큰 작업이 등장하면서 계층화가 필요해졌다.

## 선택지

1. **라벨로만 구분**: `epic`, `story`, `task` 라벨 부착 (관계 없음, 평면적)
2. **GitHub Sub-issues**: 이슈 간 부모-자식 관계를 설정하고, Type 필드로 분류
3. **외부 도구**: Notion, Linear 등 별도 프로젝트 관리 도구 도입

## 결정

**GitHub Sub-issues + Type 필드** 방식을 채택한다.

### 계층 구조

```
Epic (큰 목표)
└── Story (사용자 관점의 기능 단위, PM이 작성)
    └── Task (기술 구현 단위, Architecture/BE/FE가 작성)
```

### 프로젝트 보드 설정

- **Status 필드**: Backlog → Todo → In Progress → Done
- **Type 필드**: Epic / Story / Task (Single Select)
- **라벨**: `epic`, `story`, `task` (이슈에도 부착)
- **Sub-issues**: GitHub 네이티브 기능으로 부모-자식 관계 설정

### 작성 규칙

| 레벨 | 작성자 | 내용 | 예시 |
|------|--------|------|------|
| Epic | PM | 큰 목표 (비즈니스) | "인스타그램 스타일 피드" |
| Story | PM | 사용자 스토리 + 수용 기준 | "피드에서 사진이 잘 보여야 한다" |
| Task | Architecture/BE/FE | 기술 구현 단위 | "[FE] PostCard 1:1 비율 + 캐러셀" |

### Backlog 컬럼 추가

- 아직 착수 시기가 정해지지 않은 아이템은 Backlog에 배치
- Todo와 구분하여 "언젠가 할 것"과 "이번에 할 것"을 분리

## 결과

- Epic 이슈를 열면 하위 Story 진행률이 체크박스로 보임
- Story를 열면 하위 Task 진행률이 보임
- Table 뷰에서 Type별 그룹핑으로 계층 시각화 가능
- `Parent issue` 컬럼으로 어떤 Epic/Story에 속하는지 추적 가능
