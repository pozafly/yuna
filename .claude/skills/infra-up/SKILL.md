---
description: Docker Compose 로컬 인프라(PostgreSQL, MinIO)를 실행하고 상태를 확인합니다
user-invocable: true
allowed-tools: Bash, Read
---

로컬 개발 인프라를 실행하고 상태를 점검합니다.

1. `docker compose -f infra/docker-compose.yml up -d`로 인프라 기동
2. `docker compose -f infra/docker-compose.yml ps`로 컨테이너 상태(Up/Exited) 확인
3. PostgreSQL healthcheck 확인 (포트 5432)
4. MinIO healthcheck 확인 (API 포트 9000, Console 포트 9001)
5. 문제가 있는 컨테이너가 있으면 `docker compose logs <서비스명> --tail=30`으로 로그 조회

모든 서비스가 healthy 상태인지 확인하고 결과를 보고합니다.
