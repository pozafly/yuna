#!/bin/bash
# PreToolUse(Edit|Write) — 민감한 파일 수정을 차단한다.
# exit 2 → 차단 (stderr가 Claude에 전달됨)
# exit 0 → 허용

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# 차단 대상 패턴
PROTECTED_PATTERNS=(
  "\.env$"
  "\.env\.local$"
  "\.env\.production$"
  "pnpm-lock\.yaml$"
  "package-lock\.json$"
  "yarn\.lock$"
  "/\.git/"
)

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if echo "$FILE_PATH" | grep -qE "$pattern"; then
    echo "[훅 차단] 보호된 파일입니다: $FILE_PATH" >&2
    echo "환경변수(.env) 및 lock 파일은 직접 수정할 수 없습니다." >&2
    echo "환경변수 변경이 필요하면 사용자에게 요청하세요." >&2
    exit 2
  fi
done

exit 0
