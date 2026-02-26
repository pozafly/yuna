# TECH-B: 인증 플로우 시퀀스

> **문서 상태**: 1차 확정 (2026-02-27)

---

## 1. 인증 전략 요약

| 항목 | 결정 |
|------|------|
| 최초 진입 | 이메일 초대 → **매직링크** 클릭으로만 가능 |
| 로그인 방식 | 매직링크 이메일 / Google OAuth / Naver OAuth |
| 계정 통합 | 동일 이메일 → 동일 계정 (Provider 무관 통합) |
| 세션 방식 | **HttpOnly Cookie** 기반 (서버 발급 Access + Refresh Token) |
| localStorage JWT 저장 | **금지** (보안 탈취 리스크) |
| 권한 최종 판단 | **서버** (프론트 숨김은 보안 수단 아님) |

---

## 2. 플로우 A: 최초 초대 → 매직링크 → 가입 → 세션

### 시퀀스 다이어그램

```
[OWNER]           [FE: web]          [BE: api]            [이메일 서버]       [DB / Redis]
   │                  │                   │                      │                  │
   │── 초대 발송 ───► │                   │                      │                  │
   │                  │── POST /invitations ──────────────────► │                  │
   │                  │                   │── Invitation 생성 ──────────────────► │
   │                  │                   │   (token, expiresAt=+30min)           │
   │                  │                   │── 초대 이메일 발송 ─────────────────► │
   │                  │                   │                      │◄── 발송 완료 ── │
   │                  │◄── 201 Created ── │                      │                  │
   │                  │                   │                      │                  │
   .                  .                   .                      .                  .
   .         [INVITED: 이메일 수신 → 링크 클릭]                  .                  .
   .                  .                   .                      .                  .
   │             [INVITED]               │                      │                  │
   │                  │── GET /auth/invite/verify?token=xxx ──► │                  │
   │                  │                   │── token 조회 ───────────────────────► │
   │                  │                   │◄── Invitation 반환 ──────────────────── │
   │                  │                   │── 만료 검사 (expiresAt > now?)          │
   │                  │                   │                                         │
   │                  │   [토큰 유효한 경우]                                         │
   │                  │                   │── User 존재 여부 확인 ─────────────── ► │
   │                  │                   │                                         │
   │          [신규 사용자인 경우]          │                                         │
   │                  │◄── 302 → /onboarding?session=tmp ─ │                       │
   │                  │── POST /auth/register (이름 입력) ─► │                      │
   │                  │                   │── User 생성 ──────────────────────── ► │
   │                  │                   │── BabyMembership 생성 (role=INVITED) ► │
   │                  │                   │── Invitation.status = ACCEPTED ──── ► │
   │                  │                   │── Access/Refresh Token 발급            │
   │                  │◄── Set-Cookie: accessToken (HttpOnly) ─────────────────── │
   │                  │◄── Set-Cookie: refreshToken (HttpOnly) ────────────────── │
   │                  │                   │                                         │
   │          [기존 사용자인 경우]          │                                         │
   │                  │                   │── BabyMembership 생성 (role=INVITED) ► │
   │                  │                   │── Invitation.status = ACCEPTED ──── ► │
   │                  │                   │── Access/Refresh Token 재발급          │
   │                  │◄── Set-Cookie: accessToken/refreshToken (HttpOnly) ─────── │
   │                  │                   │                                         │
   │                  │── 피드 페이지로 리다이렉트 ──────────────────────────────── │
```

---

## 3. 플로우 B: 매직링크 로그인 (기존 사용자)

```
[INVITED/OWNER]   [FE: web]          [BE: api]            [이메일 서버]
      │                │                   │                     │
      │── 로그인 요청 ─► │                   │                     │
      │    (이메일 입력) │── POST /auth/magic-link ──────────────► │
      │                │                   │── 매직링크 이메일 발송 ─────────────► │
      │                │◄── 200 OK ─────── │                     │
      │                │                   │                     │
      .      [이메일 수신 → 링크 클릭]       .                     .
      │                │                   │
      │                │── GET /auth/magic-link/verify?token=xxx ─► │
      │                │                   │── token 검증 (30분 만료)
      │                │                   │── User 조회, 세션 발급
      │                │◄── Set-Cookie: accessToken/refreshToken (HttpOnly)
      │                │── 피드 리다이렉트
```

---

## 4. 플로우 C: Google / Naver OAuth 로그인

```
[사용자]         [FE: web]          [BE: api]          [Google/Naver]       [DB]
   │                │                   │                     │               │
   │── 소셜 로그인 버튼 클릭 ─────────────────────────────────               │
   │                │── GET /auth/google ────────────────────► │              │
   │                │                   │── 302 → Google OAuth URL            │
   │                │                   [브라우저가 Google로 이동]             │
   │                │                   [사용자 Google 인증 완료]             │
   │                │                   │◄── callback: code ── │              │
   │                │── GET /auth/google/callback?code=xxx ──► │              │
   │                │                   │── Google token 교환                │
   │                │                   │── 이메일 추출                       │
   │                │                   │── 동일 이메일 User 존재 확인 ──────► │
   │                │                   │                                     │
   │                │   [기존 계정 존재]  │── OAuthProvider 연결 기록 ────────► │
   │                │   [계정 없음]      │── User 신규 생성 ──────────────────► │
   │                │                   │── Access/Refresh Token 발급
   │                │◄── Set-Cookie: accessToken/refreshToken (HttpOnly)
   │                │── 피드 리다이렉트
```

> **계정 통합 원칙**: Google/Naver/매직링크 모두 **이메일을 기준으로 단일 User**에 연결된다.
> 동일 이메일로 다른 Provider 로그인 시 기존 계정에 Provider만 추가 연결(merge)한다.

---

## 5. 플로우 D: 세션 유지 / 토큰 갱신

```
[FE: web]                              [BE: api]
    │── API 요청 (Cookie: accessToken) ─► │
    │                                     │── accessToken 검증
    │            [유효한 경우]             │── 요청 처리 → 응답
    │◄── 200 + 데이터 ─────────────────── │
    │                                     │
    │            [만료된 경우]             │
    │◄── 401 Unauthorized ─────────────── │
    │── API 요청 (Cookie: refreshToken) ─► │
    │                                     │── refreshToken 검증
    │◄── Set-Cookie: newAccessToken ────── │
    │── 원래 요청 재시도 ─────────────────► │
```

---

## 6. Cookie 세션 정책

| 항목 | 값 |
|------|---|
| Cookie 속성 | `HttpOnly`, `Secure`, `SameSite=Strict` |
| accessToken TTL | **15분** |
| refreshToken TTL | **30일** |
| 저장 위치 | 서버 메모리 / Redis (refreshToken DB 관리) |
| logout 처리 | 서버에서 refreshToken 무효화 + Cookie 삭제 |

---

## 7. 인증 가드 동작 (BE 공통)

```
모든 보호 API 요청:
  1. Cookie에서 accessToken 추출
  2. 서버에서 서명 검증 + 만료 확인
  3. User.status = ACTIVE 확인
  4. 해당 Baby의 BabyMembership.status = ACTIVE 확인
  5. visibility 권한 확인 (PRIVATE → OWNER만)
  6. Baby.status = ACTIVE 확인 (삭제된 Baby 접근 차단)

→ 위 조건 중 하나라도 실패하면 401/403 반환
→ 프론트엔드의 표시 여부와 무관하게 서버가 독립적으로 판단
```

---

## 8. 보안 정책 요약

| 항목 | 결정 |
|------|------|
| JWT localStorage 저장 | **금지** |
| 링크 직접 접근 | 서버에서 차단, 인증 없으면 401 |
| 이미지 URL 직접 접근 | 서버에서 권한 재검증 (presigned URL만 허용) |
| 초대 없는 가입 | **금지** (매직링크 없으면 가입 불가) |
| 차단/탈퇴 사용자 | 세션 무효화 즉시 처리 |
