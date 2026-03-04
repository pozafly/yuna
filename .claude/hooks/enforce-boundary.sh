#!/bin/bash
# PreToolUse(Edit|Write) — 워크스페이스 경계 위반을 차단한다.
# 사용법: enforce-boundary.sh <allowed-workspace>
#   allowed-workspace: "api" | "web" | "shared-types" | "all"
#
# 에이전트별 훅에서 호출:
#   Backend  → enforce-boundary.sh api
#   Frontend → enforce-boundary.sh web

set -euo pipefail

ALLOWED_WORKSPACE="${1:-all}"

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# "all"이면 제한 없음
if [[ "$ALLOWED_WORKSPACE" == "all" ]]; then
  exit 0
fi

# packages/shared-types는 architecture 에이전트만 수정 가능
# (backend/frontend는 읽기만 허용)
case "$ALLOWED_WORKSPACE" in
  api)
    # Backend 에이전트: apps/web 수정 차단
    if echo "$FILE_PATH" | grep -qE "apps/web/"; then
      echo "[훅 차단] Backend 에이전트는 apps/web/ 파일을 수정할 수 없습니다." >&2
      echo "FE 코드 수정이 필요하면 Frontend 에이전트에 요청하세요." >&2
      exit 2
    fi
    ;;
  web)
    # Frontend 에이전트: apps/api 수정 차단
    if echo "$FILE_PATH" | grep -qE "apps/api/"; then
      echo "[훅 차단] Frontend 에이전트는 apps/api/ 파일을 수정할 수 없습니다." >&2
      echo "BE 코드 수정이 필요하면 Backend 에이전트에 요청하세요." >&2
      exit 2
    fi
    ;;
esac

exit 0
