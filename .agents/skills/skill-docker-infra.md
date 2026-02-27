---
name: Docker & Infra Management
description: Docker Compose 기반 로컬 개발 환경(PostgreSQL, MinIO) 관리 및 상태 점검
---
# Docker & Infra Management 스킬

**목적:** Yuna 프로젝트의 로컬 개발 인프라(PostgreSQL DB, MinIO 오브젝트 스토리지 등)를 Docker Compose로 구동·중단하고, 컨테이너 상태와 로그를 점검하여 안정적인 개발 환경을 유지합니다.

**사용 시점:**
- 개발 환경 최초 세팅 또는 컨테이너가 내려갔을 때 재기동이 필요할 때
- DB 마이그레이션 전후로 PostgreSQL 컨테이너의 정상 상태를 확인할 때
- MinIO 버킷 설정이 올바른지, Presigned URL이 정상 발급되는지 점검할 때
- 컨테이너 로그에서 에러·경고 메시지를 분석하여 인프라 문제를 진단할 때

**사용 방법 (가이드):**
- `docker-compose -f infra/docker-compose.yml up -d`로 전체 인프라를 백그라운드 기동합니다.
- `docker-compose ps`로 컨테이너 상태(Up/Exited)를 확인하고, `docker-compose logs <서비스명> --tail=50`으로 최근 로그를 조회합니다.
- 볼륨 초기화가 필요한 경우 `docker-compose down -v` 후 재기동하되, **데이터 유실에 주의**하세요.
