# TECH-C: Docker Compose 설계

> **문서 상태**: 1차 확정 (2026-02-27)
> **용도**: 로컬 개발 환경 전용 (운영 환경은 별도 구성)

---

## 1. 서비스 구성 요약

| 서비스 | 이미지 | 역할 | 포트 |
|--------|--------|------|------|
| `postgres` | `postgres:16-alpine` | 관계형 DB | 5432 |
| `minio` | `minio/minio:latest` | 오브젝트 스토리지 | 9000 (API), 9001 (Console) |
| `minio-init` | `minio/mc:latest` | 버킷 초기화 Job (1회 실행 후 종료) | — |

> FE(`apps/web`)와 BE(`apps/api`)는 로컬 `pnpm dev`로 실행한다. Docker에 포함하지 않는다.

---

## 2. 볼륨 구성

| 볼륨명 | 마운트 위치 | 설명 |
|--------|-----------|------|
| `yuna_postgres_data` | `/var/lib/postgresql/data` | PG 데이터 영속성 보존 |
| `yuna_minio_data` | `/data` | MinIO 오브젝트 영속성 보존 |

> **프로젝트 고유 prefix `yuna_`**: 다른 프로젝트 볼륨과 충돌 방지.
> 볼륨을 명시적으로 선언하여 `docker-compose down` 시에도 데이터 유지.
> `docker-compose down -v` 는 **볼륨까지 삭제**하므로 주의 필요.

---

## 3. Network 구성

| 네트워크명 | 드라이버 | 설명 |
|-----------|---------|------|
| `yuna_local` | bridge | 서비스 간 내부 통신 (BE → PG, BE → MinIO) |

---

## 4. 환경변수 목록

### 4-1. `postgres` 서비스

| 환경변수 | 예시 값 | 설명 |
|---------|--------|------|
| `POSTGRES_USER` | `yuna_user` | DB 사용자명 |
| `POSTGRES_PASSWORD` | `yuna_secret` | DB 비밀번호 |
| `POSTGRES_DB` | `yuna_dev` | 개발용 DB명 |

### 4-2. `minio` 서비스

| 환경변수 | 예시 값 | 설명 |
|---------|--------|------|
| `MINIO_ROOT_USER` | `minio_admin` | MinIO 관리자 사용자 |
| `MINIO_ROOT_PASSWORD` | `minio_secret` | MinIO 관리자 비밀번호 |

### 4-3. `minio-init` 서비스 (버킷 초기화)

| 환경변수 | 예시 값 | 설명 |
|---------|--------|------|
| `MINIO_HOST` | `http://minio:9000` | MinIO 내부 호스트 |
| `MINIO_ROOT_USER` | (minio와 동일) | mc 인증용 |
| `MINIO_ROOT_PASSWORD` | (minio와 동일) | mc 인증용 |

---

## 5. Docker Compose 설계 (설계 수준)

```yaml
# infra/docker-compose.yml (설계 — 구현 시 실제 파일로 전환)

version: '3.9'

services:
  postgres:
    image: postgres:16-alpine
    container_name: yuna-postgres
    restart: unless-stopped
    ports:
      - '5432:5432'
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-yuna_user}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-yuna_secret}
      POSTGRES_DB: ${POSTGRES_DB:-yuna_dev}
    volumes:
      - yuna_postgres_data:/var/lib/postgresql/data
    networks:
      - yuna_local
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER:-yuna_user}']
      interval: 5s
      timeout: 5s
      retries: 5

  minio:
    image: minio/minio:latest
    container_name: yuna-minio
    restart: unless-stopped
    command: server /data --console-address ":9001"
    ports:
      - '9000:9000'   # API
      - '9001:9001'   # Console (웹 UI)
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minio_admin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minio_secret}
    volumes:
      - yuna_minio_data:/data
    networks:
      - yuna_local
    healthcheck:
      test: ['CMD', 'mc', 'ready', 'local']
      interval: 5s
      timeout: 5s
      retries: 5

  minio-init:
    image: minio/mc:latest
    container_name: yuna-minio-init
    depends_on:
      minio:
        condition: service_healthy
    entrypoint: /bin/sh
    command: /init-buckets.sh
    volumes:
      - ./minio/init-buckets.sh:/init-buckets.sh:ro
    environment:
      MINIO_HOST: http://minio:9000
      MINIO_ROOT_USER: ${MINIO_ROOT_USER:-minio_admin}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD:-minio_secret}
    networks:
      - yuna_local

volumes:
  yuna_postgres_data:
    name: yuna_postgres_data
  yuna_minio_data:
    name: yuna_minio_data

networks:
  yuna_local:
    name: yuna_local
    driver: bridge
```

---

## 6. 버킷 초기화 스크립트 설계

```bash
#!/bin/sh
# infra/minio/init-buckets.sh

set -e

# MinIO 서버 alias 설정
mc alias set yuna "$MINIO_HOST" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"

# 버킷 생성 (이미 있으면 스킵)
mc mb --ignore-existing yuna/originals
mc mb --ignore-existing yuna/thumbs

# 버킷 접근 정책: 비공개 (public 접근 금지)
mc anonymous set none yuna/originals
mc anonymous set none yuna/thumbs

echo "✅ MinIO buckets initialized: originals, thumbs (private)"
```

---

## 7. FE / BE 로컬 .env 파일 구성

### 7-1. `apps/api/.env` (BE)

```env
# DB
DATABASE_URL=postgresql://yuna_user:yuna_secret@localhost:5432/yuna_dev

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minio_admin
MINIO_SECRET_KEY=minio_secret
MINIO_USE_SSL=false
MINIO_BUCKET_ORIGINALS=originals
MINIO_BUCKET_THUMBS=thumbs

# Auth
JWT_SECRET=dev-jwt-secret-change-in-production
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
MAGIC_LINK_TTL=30m

# OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
NAVER_CALLBACK_URL=http://localhost:3000/auth/naver/callback

# Mail (개발: console 출력 또는 Mailtrap)
MAIL_HOST=
MAIL_PORT=
MAIL_USER=
MAIL_PASS=

# App
APP_URL=http://localhost:3001
API_PORT=3000
```

### 7-2. `apps/web/.env.local` (FE)

```env
# API 서버 연결 정보
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## 8. 개발 환경 실행 순서

```bash
# 1. 인프라 서비스 실행
cd infra
docker compose up -d

# 2. MinIO Console 접속 (선택)
# http://localhost:9001 → minio_admin / minio_secret

# 3. BE 의존성 설치 및 실행
pnpm install         # 루트에서 전체 의존성 설치
pnpm --filter api dev   # NestJS dev server (포트 3000)

# 4. FE 실행
pnpm --filter web dev   # Next.js dev server (포트 3001)
```

---

## 9. 주의사항

| 항목 | 내용 |
|------|------|
| `docker compose down -v` | 볼륨까지 삭제 — 로컬 데이터 초기화. 신중히 사용 |
| 포트 충돌 | PG(5432), MinIO(9000, 9001)가 다른 프로젝트와 겹치지 않는지 확인 |
| .env 파일 관리 | `.env`는 `.gitignore`에 포함. `.env.example`만 커밋 |
| Apple Silicon | `postgres:16-alpine`은 arm64 지원. MinIO도 멀티 아치 지원 확인됨 |
