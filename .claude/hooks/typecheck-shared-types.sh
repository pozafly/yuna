#!/bin/bash
# PostToolUse(Edit|Write) — shared-types 수정 시 자동으로 pnpm type-check 실행
# 타입 에러가 있으면 Claude에게 피드백으로 전달한다.

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# shared-types 파일 수정 시에만 실행
if ! echo "$FILE_PATH" | grep -qE "packages/shared-types/"; then
  exit 0
fi

# 프로젝트 루트로 이동
cd "$(dirname "$0")/../.."

echo "[훅] shared-types 변경 감지 — pnpm type-check 실행 중..."

# type-check 실행 (실패해도 결과를 Claude에 전달)
TYPE_CHECK_OUTPUT=$(pnpm type-check 2>&1) || true
EXIT_CODE=$?

if [[ $EXIT_CODE -ne 0 ]]; then
  echo "[훅 경고] shared-types 변경 후 타입 에러가 발견되었습니다:" >&2
  echo "$TYPE_CHECK_OUTPUT" >&2
  echo "" >&2
  echo "FE(apps/web)와 BE(apps/api) 양쪽의 타입 호환성을 확인하세요." >&2
  # exit 0으로 차단하지는 않지만, 경고를 전달
fi

exit 0
