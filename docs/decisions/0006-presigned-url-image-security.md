# 0006. Presigned URL 기반 이미지 보안

- **상태**: Accepted
- **날짜**: 2026-03-04

## 배경

Yuna의 핵심 원칙 중 하나는 **외부 공유 차단** — 인증·권한 없이 링크로 이미지에 직접 접근할 수 없어야 한다.
MinIO(S3 호환)에 저장된 아기/가족 사진을 안전하게 보여주면서도 성능을 유지해야 한다.

## 선택지

1. **Public 버킷**: 이미지 URL을 직접 노출 (빠르지만 보안 위반)
2. **API 프록시**: 모든 이미지 요청을 NestJS가 중계 (안전하지만 서버 부하 큼)
3. **Presigned GET URL**: BE가 임시 서명 URL을 발급, FE가 MinIO에 직접 접근 (안전 + 성능)

## 결정

**Presigned GET URL 방식**을 채택한다.

### 동작 흐름

```
1. FE → BE: GET /posts (게시물 목록 요청)
2. BE: Post 조회 → 각 PostMedia의 objectKey로 MinIO Presigned GET URL 생성 (유효기간: 1시간)
3. BE → FE: Post 응답에 presignedUrl 필드 포함
4. FE: <img src={presignedUrl} /> 로 MinIO에서 직접 이미지 로드
5. URL 만료 후: 새로운 Presigned URL을 다시 요청해야 함
```

### 업로드 흐름 (Presigned PUT URL)

```
1. FE → BE: POST /storage/presigned-url (업로드 URL 요청, 권한 검증)
2. BE → FE: Presigned PUT URL 반환
3. FE → MinIO: PUT 요청으로 이미지 직접 업로드 (서버 부하 없음)
4. FE → BE: POST /posts (objectKey 포함하여 게시물 생성)
```

### 보안 규칙

- MinIO 버킷은 **Private** — 직접 접근 불가
- Presigned URL의 유효기간은 **1시간** (GET), **15분** (PUT)
- URL 발급 시 반드시 BabyMembership 권한 검증 수행
- FE에서 URL이 만료되면 자동으로 재요청하는 로직 필요

## 결과

- 이미지가 인증 없이 외부에 노출되지 않음 → 폐쇄형 원칙 준수
- BE가 이미지 트래픽을 직접 처리하지 않음 → 서버 부하 최소화
- FE는 일반 `<img>` 태그로 이미지를 렌더링 → 구현 복잡도 낮음
- URL 만료 처리가 필요 → FE에 에러 핸들링/재요청 로직 추가
