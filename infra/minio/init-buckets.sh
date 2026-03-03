#!/bin/sh
set -e

# MinIO 서버 alias 설정
mc alias set yuna "$MINIO_HOST" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"

# 버킷 생성 (이미 있으면 스킵)
mc mb --ignore-existing yuna/originals
mc mb --ignore-existing yuna/thumbs

# 버킷 접근 정책: 비공개 (public 접근 금지)
mc anonymous set none yuna/originals
mc anonymous set none yuna/thumbs

echo "MinIO buckets initialized: originals, thumbs (private)"
