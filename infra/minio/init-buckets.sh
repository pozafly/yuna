#!/bin/sh
set -e

mc alias set yuna "$MINIO_HOST" "$MINIO_ROOT_USER" "$MINIO_ROOT_PASSWORD"
mc mb --ignore-existing yuna/originals
mc mb --ignore-existing yuna/thumbs
mc anonymous set none yuna/originals
mc anonymous set none yuna/thumbs

echo "MinIO buckets initialized: originals, thumbs"
