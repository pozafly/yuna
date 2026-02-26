# PRD-D: 데이터 개체 목록 (개체/관계 개념도)

> **문서 상태**: 2차 업데이트 (2026-02-26)
> 이 문서는 스키마 수준이 아닌 **개념 수준의 개체·관계**를 정의한다.

---

## 1. 핵심 개체(Entity) 목록

### User (사용자)

| 속성 | 설명 |
|------|------|
| id | 고유 식별자 |
| email | 로그인·초대 기반 식별자 |
| name | 표시 이름 |
| password | 인증용 (해시) |
| createdAt | 가입 일시 |
| status | 활성(ACTIVE) / 탈퇴(WITHDRAWN) |

---

### Baby (아기)

| 속성 | 설명 |
|------|------|
| id | 고유 식별자 |
| name | 아기 이름 |
| gender | 성별 |
| birthDate | 생년월일 (마일스톤 계산 기준) |
| status | `ACTIVE` / `DELETED` |
| deletedAt | 삭제 일시 (DELETED인 경우) |
| downloadExpiresAt | 다운로드 가능 마감일 (deletedAt + 30일) |
| createdAt | Baby 생성 일시 |

---

### BabyMembership (Baby 구성원 관계)

> INVITED 사용자와 Baby 사이의 관계를 표현한다.

| 속성 | 설명 |
|------|------|
| id | 고유 식별자 |
| babyId | Baby FK |
| userId | User FK (INVITED 사용자) |
| role | 역할 (`OWNER` / `INVITED`) |
| status | `ACTIVE` / `BLOCKED` / `WITHDRAWN` |
| invitedAt | 초대 발송 일시 |
| joinedAt | 초대 수락(가입) 일시 |
| blockedAt | 차단 일시 (차단된 경우) |
| withdrawnAt | 탈퇴 일시 (탈퇴한 경우) |

---

### Invitation (초대)

| 속성 | 설명 |
|------|------|
| id | 고유 식별자 |
| babyId | 어떤 Baby에 대한 초대인지 (FK) |
| inviterId | 초대를 발송한 OWNER User id (FK) |
| inviteeEmail | 초대받는 사람의 이메일 |
| token | 초대 토큰 (일회용) |
| expiresAt | 토큰 만료 일시 (발송 후 30분) |
| status | `PENDING` / `ACCEPTED` / `EXPIRED` / `CANCELLED` |
| createdAt | 초대 발송 일시 |

---

### Post (게시물 / 사진 피드)

| 속성 | 설명 |
|------|------|
| id | 고유 식별자 |
| babyId | 어느 Baby의 피드인지 (FK) |
| authorId | 작성한 User id (FK, OWNER만 작성 가능) |
| content | 게시물 본문 텍스트 |
| visibility | `PRIVATE` / `INVITED` |
| takenAt | 사진 촬영 날짜 (아카이브·마일스톤 기준) |
| createdAt | 게시 일시 |
| updatedAt | 최종 수정 일시 |

---

### PostMedia (게시물 첨부 사진)

| 속성 | 설명 |
|------|------|
| id | 고유 식별자 |
| postId | Post FK |
| storageKey | 서버 내 이미지 저장 경로/키 |
| order | 사진 순서 (Carousel 순서) |
| createdAt | 업로드 일시 |

> **다운로드 버튼 미제공**: UI에서 다운로드 버튼을 노출하지 않는다.
> **외부 공유 차단**: `storageKey`로 직접 접근 시 인증·권한 체크 필수.

---

### Letter (편지 / 타임캡슐)

| 속성 | 설명 |
|------|------|
| id | 고유 식별자 |
| babyId | 어느 Baby에 대한 편지인지 (FK) |
| authorId | 작성한 User id (FK, OWNER·INVITED 모두 가능) |
| title | 편지 제목 |
| content | 편지 본문 |
| visibility | `PRIVATE` / `INVITED` |
| createdAt | 작성 일시 (정렬·조회 기준) |
| updatedAt | 최종 수정 일시 |

---

### Comment (댓글)

| 속성 | 설명 |
|------|------|
| id | 고유 식별자 |
| targetType | 댓글 대상 유형: `POST` / `LETTER` |
| targetId | 대상 Post 또는 Letter의 id |
| authorId | 작성한 User id (FK) |
| content | 댓글 내용 |
| createdAt | 작성 일시 |
| updatedAt | 최종 수정 일시 |

> **열람 권한**: 상위 콘텐츠(Post/Letter)에 접근 권한이 있는 경우에만 댓글 열람 가능.
> **삭제**: 작성자 본인만 가능 (OWNER도 타인 댓글 삭제 불가).

---

### Notification (알림)

| 속성 | 설명 |
|------|------|
| id | 고유 식별자 |
| recipientId | 알림 수신 User id (FK) |
| type | `NEW_POST` / `NEW_COMMENT` / `NEW_LETTER` / `INVITATION` |
| targetType | 알림 관련 개체 유형 (POST / LETTER / COMMENT / INVITATION) |
| targetId | 알림 관련 개체 id |
| isRead | 읽음 여부 |
| createdAt | 알림 발생 일시 |

---

### BabyDataDownload (Baby 삭제 후 다운로드 이력)

> Baby 삭제 후 30일 이내 OWNER가 데이터를 다운로드한 기록을 관리한다.

| 속성 | 설명 |
|------|------|
| id | 고유 식별자 |
| babyId | 삭제된 Baby FK |
| requestedById | 다운로드 요청한 OWNER User id (FK) |
| requestedAt | 다운로드 요청 일시 |
| status | `PENDING` / `READY` / `DOWNLOADED` / `EXPIRED` |

---

## 2. 개체 관계 개념도

```
┌─────────────────────────────────────────────────────────────────┐
│                          User                                    │
│  (id, email, name, status)                                       │
└──────────────┬───────────────────────────────────┬──────────────┘
               │ ownerId                           │ authorId
               ▼                                   │
┌─────────────────────────────┐                    │
│           Baby               │                    │
│  (id, name, gender, birth)  │                    │
└──────┬───────────┬──────────┘                    │
       │ babyId    │ babyId                         │
       ▼           ▼                                │
┌──────────┐  ┌──────────────────┐                 │
│Invitation│  │ BabyMembership   │                 │
│(token,   │  │(userId, babyId,  │                 │
│ status,  │  │ role, status)    │                 │
│ expires) │  └──────────────────┘                 │
└──────────┘                                        │
                                                    │
       ┌────────────────────────────────────────────┘
       │
       ├──── Post (visibility, takenAt)
       │       └── PostMedia (storageKey, order)
       │       └── Comment (targetType=POST)
       │
       └──── Letter (visibility, createdAt)
               └── Comment (targetType=LETTER)

┌─────────────────────────────────────────────────────────────────┐
│                       Notification                               │
│  recipientId ──► User                                            │
│  targetId    ──► Post / Letter / Comment / Invitation           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. 핵심 관계 정리

| 관계 | 설명 |
|------|------|
| User `N` ─── `N` Baby | **공동 OWNER**: 여러 OWNER가 한 Baby를 소유 가능, BabyMembership(role=OWNER)으로 표현 |
| Baby `1` ─── `N` BabyMembership | 한 Baby에 여러 구성원 (OWNER + INVITED 모두 포함) |
| User `1` ─── `N` BabyMembership | 한 User가 여러 Baby에 초대될 수 있음 |
| Baby `1` ─── `N` Invitation | 한 Baby에 여러 초대 발송 가능 |
| Baby `1` ─── `N` Post | 한 Baby의 피드에 여러 게시물 |
| Post `1` ─── `N` PostMedia | 한 게시물에 여러 사진 |
| Baby `1` ─── `N` Letter | 한 Baby에 여러 편지 |
| Post or Letter `1` ─── `N` Comment | 게시물/편지에 여러 댓글 |
| User `1` ─── `N` Notification | 한 User가 여러 알림 수신 |
| Baby `1` ─── `N` BabyDataDownload | 삭제된 Baby의 다운로드 이력 |

---

## 4. 접근 제어 핵심 로직 (개념)

```
콘텐츠 접근 가능 조건:
  1. 요청자(User)의 status = ACTIVE
  2. 해당 Baby의 status = ACTIVE (삭제된 Baby에는 접근 불가)
  3. 해당 Baby의 BabyMembership.status = ACTIVE
  4. 콘텐츠 visibility 조건 충족:
     - PRIVATE → BabyMembership.role = OWNER 인 경우만
     - INVITED → BabyMembership.role = OWNER or INVITED
  5. 이미지(PostMedia) 접근 시 → 위 조건 서버에서 재검증 (URL 직접 접근 차단)
```

---

## 5. 미정 사항 (데이터 관점)

| 항목 | 영향 개체 | 상태 |
|------|---------|------|
| ~~OWNER 다중 허용~~ | BabyMembership.role=OWNER 다수 허용 | ✅ **확정** |
| ~~OWNER 탈퇴 시 Baby 데이터 처리~~ | Baby.status + BabyMembership | ✅ **확정**: 데이터 유지 |
| ~~Baby 삭제 + 30일 다운로드~~ | Baby.status=DELETED, BabyDataDownload | ✅ **확정** |
| 마지막 OWNER 탈퇴 시 Baby 고아 상태 처리 | Baby (OWNER 없는 고아 상태) | **미정** |
| 아카이브 내보내기 정책 (서비스 종료 등) | PostMedia 등 | **미정** |
| Letter 예약 공개 | Letter (publishAt 속성 추가 필요) | 추후 확장 |
