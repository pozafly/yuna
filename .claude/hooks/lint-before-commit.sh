#!/bin/bash
# PreToolUse(Bash) — git commit 실행 전 ESLint 체크
# commit 명령이 아닌 경우 즉시 통과시킨다.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [[ -z "$COMMAND" ]]; then
  exit 0
fi

# git commit 명령이 아니면 통과
if ! echo "$COMMAND" | grep -qE "git commit"; then
  exit 0
fi

# lint 실행
echo "커밋 전 ESLint 검사를 실행합니다..." >&2

if ! pnpm lint 2>&1 | tail -5 >&2; then
  echo "" >&2
  echo "[훅 차단] ESLint 에러가 있습니다. lint 에러를 수정한 후 커밋하세요." >&2
  exit 2
fi

exit 0
