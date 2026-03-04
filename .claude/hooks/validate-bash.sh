#!/bin/bash
# PreToolUse(Bash) — 위험한 Bash 명령어를 차단한다.
# JSON 출력으로 permissionDecision을 반환하여 세밀하게 제어한다.

set -euo pipefail

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [[ -z "$COMMAND" ]]; then
  exit 0
fi

# 차단 대상 패턴 (대소문자 무시)
DANGEROUS_PATTERNS=(
  "rm -rf /"
  "rm -rf \."
  "rm -rf \*"
  "DROP DATABASE"
  "DROP TABLE"
  "DROP SCHEMA"
  "TRUNCATE TABLE"
  "DELETE FROM.*WHERE 1"
  "DELETE FROM.*WITHOUT"
  "docker compose down -v"
  "git push.*--force"
  "git reset --hard"
  "git clean -fd"
  "chmod 777"
  ":(){ :|:& };:"
)

for pattern in "${DANGEROUS_PATTERNS[@]}"; do
  if echo "$COMMAND" | grep -qiE "$pattern"; then
    echo "[훅 차단] 위험한 명령어가 감지되었습니다: $pattern" >&2
    echo "이 명령어는 데이터 손실이나 시스템 손상을 유발할 수 있습니다." >&2
    echo "정말 필요하다면 사용자에게 직접 실행을 요청하세요." >&2
    exit 2
  fi
done

exit 0
