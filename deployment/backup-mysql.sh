#!/usr/bin/env sh
set -eu

COMPOSE_FILE="${COMPOSE_FILE:-deployment/docker-compose.yml}"
OUTPUT_DIR="${OUTPUT_DIR:-./backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p "$OUTPUT_DIR"

docker compose -f "$COMPOSE_FILE" exec -T db sh -c \
  'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" --single-transaction --routines --triggers --databases "$MYSQL_DATABASE"' \
  | gzip > "$OUTPUT_DIR/erp-$STAMP.sql.gz"

echo "Backup saved: $OUTPUT_DIR/erp-$STAMP.sql.gz"
