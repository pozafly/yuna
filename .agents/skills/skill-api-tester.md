---
name: API Tester (HTTP Request)
description: curl 또는 HTTP 클라이언트를 이용한 REST API 엔드포인트 직접 검증
---
# API Tester (HTTP Request) 스킬

**목적:** 구현된 NestJS API 엔드포인트에 실제 HTTP 요청을 보내어 응답 코드, 응답 바디, 권한 처리가 기획 명세대로 동작하는지 검증합니다.

**사용 시점:**
- 신규 Controller/Service 구현 직후 Happy Path(정상 케이스)를 빠르게 확인할 때
- OWNER vs INVITED 권한 분기가 API 레벨에서 올바르게 막히는지(403/401) 검증할 때
- Presigned URL 발급 등 MinIO 연동 로직의 응답값을 실제로 확인할 때

**사용 방법 (가이드):**
- `curl -X METHOD URL -H "Authorization: Bearer <token>" -d '{"key":"value"}'` 형태로 터미널에서 직접 요청을 전송합니다.
- 권한 테스트 시, OWNER 토큰과 INVITED 토큰을 분리하여 각각 요청하고 응답 코드를 비교합니다.
- 응답 결과는 `[요청] - [기대 상태코드] - [실제 상태코드]` 형식으로 간결하게 정리하여 리포팅합니다.
