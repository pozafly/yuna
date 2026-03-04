---
description: Playwright로 FE 보호 경로 접근 제어, 권한별 UI 노출, 접근성을 검증합니다
user-invocable: true
argument-hint: "[route-or-scope]"
allowed-tools: Bash, Read, Grep, Glob, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_snapshot, mcp__plugin_playwright_playwright__browser_take_screenshot, mcp__plugin_playwright_playwright__browser_click, mcp__plugin_playwright_playwright__browser_evaluate, mcp__plugin_playwright_playwright__browser_console_messages, mcp__plugin_playwright_playwright__browser_network_requests, mcp__plugin_playwright_playwright__browser_wait_for, mcp__plugin_playwright_playwright__browser_close
---

Playwright MCP를 사용하여 FE UI를 실제 브라우저에서 검증합니다.

대상 범위: $ARGUMENTS (미지정 시 전체 보호 경로)

## 검증 항목

### 1. 인증 리다이렉트 검증

미인증 상태에서 보호 경로 접근 시 로그인 페이지로 리다이렉트되는지 확인한다.

| 보호 경로 | 기대 동작 |
|-----------|----------|
| `/feed` | → `/login` 리다이렉트 |
| `/feed/new` | → `/login` 리다이렉트 |
| `/letter` | → `/login` 리다이렉트 |
| `/letter/new` | → `/login` 리다이렉트 |
| `/settings` | → `/login` 리다이렉트 |

절차:
1. `browser_navigate`로 `http://localhost:3001/feed` 등 접근
2. `browser_snapshot`으로 현재 URL과 페이지 상태 확인
3. 로그인 페이지로 이동했는지 검증

### 2. 권한별 UI 노출 검증

인증된 상태에서 역할(OWNER/INVITED)에 따라 UI 요소가 올바르게 노출/숨김되는지 확인한다.

- OWNER 전용 버튼(삭제, 설정 변경 등)이 INVITED 사용자에게 노출되지 않는지
- visibility=PRIVATE 콘텐츠가 INVITED 사용자 화면에 렌더링되지 않는지

### 3. 콘솔 에러 검증

각 페이지 로드 후 `browser_console_messages`로 JavaScript 에러가 없는지 확인한다.
- `error` 레벨 메시지가 있으면 리포팅
- 네트워크 실패(4xx/5xx)가 있으면 리포팅

### 4. 네트워크 요청 검증

`browser_network_requests`로 비정상 요청을 확인한다.
- 인증 없이 API 호출이 발생하는지
- 불필요한 중복 요청이 있는지
- 실패한 요청이 있는지

## 리포트 형식

```
## E2E UI 검증 결과

### 인증 리다이렉트
| 경로 | 결과 | 비고 |
|------|------|------|
| /feed | ✅ PASS | /login으로 리다이렉트 |

### 콘솔 에러
- [경로] 에러 메시지 (없으면 "에러 없음")

### 네트워크 이상
- [경로] 실패한 요청 목록 (없으면 "이상 없음")

### 발견된 문제
| # | 심각도 | 경로 | 설명 |
|---|--------|------|------|
| 1 | High   | /feed | 미인증 시 리다이렉트 미작동 |
```
