---
description: API 코드의 권한 검증 로직을 PRD 권한 매트릭스와 대조하여 감사합니다
user-invocable: true
allowed-tools: Read, Grep, Glob
---

`apps/api` 코드의 권한 검증 로직이 PRD 권한 매트릭스와 일치하는지 감사합니다.

## 감사 절차

1. `docs/PRD-B_permission-matrix.md`를 읽어 권한 규칙 파악
2. `apps/api/src/` 내 모든 Controller 파일 탐색
3. 각 엔드포인트에 대해 다음을 검증:
   - Guard가 적용되어 있는가?
   - Role 기반 접근 제어가 구현되어 있는가?
   - visibility(PRIVATE/INVITED) 체크가 있는가?
   - BabyMembership 확인 로직이 있는가?
4. 발견된 취약점을 다음 형식으로 리포팅:
   - **위치**: 파일:라인
   - **위험도**: Critical / Warning / Info
   - **설명**: 누락된 검증 내용
   - **권장 수정**: 구체적 가이드

## 핵심 체크 항목

- [ ] 모든 보호 API에 AuthGuard 적용
- [ ] OWNER 전용 엔드포인트에 Role 검사
- [ ] Baby 단위 접근 제어 (BabyMembership)
- [ ] visibility 기반 콘텐츠 필터링
- [ ] 삭제된 Baby(DELETED) 접근 차단
- [ ] 차단된 사용자(BLOCKED) 접근 차단
