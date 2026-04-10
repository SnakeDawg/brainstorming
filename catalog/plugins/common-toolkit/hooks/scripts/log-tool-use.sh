#!/usr/bin/env bash
# log-tool-use.sh — append a one-line summary of every Write/Edit to a log.
#
# Wired into common-toolkit's PostToolUse hook. Reads the JSON event from
# stdin and writes a single line to ${LOG_DIR}/tool-use.log (default
# /tmp/claude-tooluse).
#
# This runs on every Write/Edit, so it's intentionally fork-free: pure bash
# regex + printf builtin for the timestamp. No grep/sed/date subprocesses.
#
# Replace the body with your own formatter, linter, or notifier — the
# contract (read JSON on stdin, exit 0) is stable.
#
# Known limitation: the JSON regex below is naive and won't handle escaped
# quotes (\") inside string values. Acceptable for tool_name / file_path,
# which Claude Code does not escape.

set -euo pipefail

LOG_DIR="${PLUGIN_USER_CONFIG_LOG_DIR:-/tmp/claude-tooluse}"
[[ -d $LOG_DIR ]] || mkdir -p "$LOG_DIR"

payload=$(cat)

# Bash 4.2+ has a builtin date formatter — no fork needed.
printf -v timestamp '%(%Y-%m-%dT%H:%M:%SZ)T' -1

tool="unknown"
if [[ $payload =~ \"tool_name\"[[:space:]]*:[[:space:]]*\"([^\"]+)\" ]]; then
    tool=${BASH_REMATCH[1]}
fi

path="unknown"
if [[ $payload =~ \"file_path\"[[:space:]]*:[[:space:]]*\"([^\"]+)\" ]]; then
    path=${BASH_REMATCH[1]}
fi

printf '%s\t%s\t%s\n' "$timestamp" "$tool" "$path" >> "$LOG_DIR/tool-use.log"
