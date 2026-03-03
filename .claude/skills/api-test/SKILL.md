---
description: curl로 NestJS API 엔드포인트를 직접 호출하여 응답 코드, 바디, 권한 처리를 검증합니다
user-invocable: true
argument-hint: "[METHOD] [endpoint] [options]"
allowed-tools: Bash, Read
---

NestJS API 엔드포인트를 직접 테스트합니다.

인수: $ARGUMENTS

## 테스트 절차

1. 대상 엔드포인트와 HTTP 메서드 확인
2. 필요한 경우 인증 토큰(Cookie) 준비
3. curl로 요청 전송:
   ```
   curl -v -X METHOD http://localhost:3000/ENDPOINT \
     -H "Content-Type: application/json" \
     -b "accessToken=<token>" \
     -d '{"key":"value"}'
   ```
4. 응답 결과를 다음 형식으로 정리:
   - **요청**: METHOD /endpoint
   - **기대 상태코드**: 2xx / 4xx
   - **실제 상태코드**: 실제 결과
   - **응답 바디**: 주요 필드 요약

권한 테스트 시에는 OWNER 토큰과 INVITED 토큰을 분리하여 각각 요청하고 결과를 비교합니다.
