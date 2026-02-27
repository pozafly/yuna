---
name: Mermaid Diagram Generation
description: 프로젝트 구조, ERD, 권한 매트릭스의 시각화 명세
---
# Mermaid Diagram Generation 스킬

**목적:** 복잡한 텍스트 기반 기획 문서나 코드 구조를 직관적인 시각적 도식으로 변환하여 다른 작업자의 개발 이해도를 높입니다.

**사용 시점:**
- 새로운 데이터베이스 테이블(Entity)이 추가되어 ERD 갱신이 필요할 때
- 사용자 역할(OWNER, INVITED)에 따른 복잡한 권한 플로우(State/Sequence Diagram)를 설명해야 할 때
- 모노레포 패키지 간의 의존성 연결 고리(Dependency Graph)를 문서화할 때

**사용 방법 (가이드):**
- 마크다운 블록에 ````mermaid` 문법을 사용하여 구문을 작성합니다.
- 각 노드마다 분명한 목적을 적고, 보안 정책이나 예외 흐름(Edge cases)을 색상(classDef)이나 주석으로 강조 표현하세요.
