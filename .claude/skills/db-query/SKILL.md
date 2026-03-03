---
description: PostgreSQL에 직접 SQL 쿼리를 실행하여 데이터 상태를 확인합니다
user-invocable: true
argument-hint: "[SQL query or table name]"
allowed-tools: Bash, Read
---

PostgreSQL 데이터베이스에 직접 쿼리를 실행하여 데이터 상태를 확인합니다.

인수: $ARGUMENTS

## 실행 방법

1. Docker 컨테이너 내에서 psql 실행:
   ```
   docker exec -i yuna-postgres psql -U yuna_user -d yuna_dev -c "$ARGUMENTS"
   ```

2. 테이블 조회 시:
   ```
   docker exec -i yuna-postgres psql -U yuna_user -d yuna_dev -c "SELECT * FROM $ARGUMENTS LIMIT 20;"
   ```

3. 스키마 확인 시:
   ```
   docker exec -i yuna-postgres psql -U yuna_user -d yuna_dev -c "\d+ $ARGUMENTS"
   ```

## 주의사항

- SELECT 이외의 작업(INSERT, UPDATE, DELETE) 시행 전에 사용자에게 확인을 받는다.
- 결과는 테이블 형태로 깔끔하게 정리하여 보고한다.
