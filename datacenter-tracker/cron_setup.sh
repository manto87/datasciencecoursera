#!/usr/bin/env bash
# Installs a daily 7 AM cron job that runs the tracker.
# Edit the path and .env location before running.

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PYTHON="${PYTHON:-python3}"
ENV_FILE="$SCRIPT_DIR/.env"

CRON_CMD="0 7 * * * cd $SCRIPT_DIR && set -a && . $ENV_FILE && set +a && $PYTHON tracker.py >> $SCRIPT_DIR/data/tracker.log 2>&1"

# Add only if not already present
( crontab -l 2>/dev/null | grep -qF "tracker.py" ) && {
    echo "Cron job already installed."
    exit 0
}

( crontab -l 2>/dev/null; echo "$CRON_CMD" ) | crontab -
echo "Cron job installed: $CRON_CMD"
