#!/bin/bash
# PostToolUse(Edit|Write) — 파일 수정 후 Prettier 자동 포맷팅
# stdin으로 JSON 입력을 받아 file_path를 추출하고 prettier를 실행한다.

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# file_path가 없으면 무시
if [[ -z "$FILE_PATH" ]]; then
  exit 0
fi

# 포맷팅 대상 확장자만 처리
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx|*.json|*.css|*.scss|*.html|*.md)
    # node_modules 내 파일은 제외
    if [[ "$FILE_PATH" == *"node_modules"* ]]; then
      exit 0
    fi

    # prettier 실행 (프로젝트 루트 기준)
    cd "$(dirname "$0")/../.."
    npx prettier --write "$FILE_PATH" 2>/dev/null || true
    ;;
esac

exit 0
