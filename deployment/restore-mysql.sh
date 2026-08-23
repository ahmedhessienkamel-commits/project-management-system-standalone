#!/usr/bin/env sh
set -eu

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 path/to/erp-backup.sql.gz" >&2
  exit 1
fi

COMPOSE_FILE="${COMPOSE_FILE:-deployment/docker-compose.yml}"
gzip -dc "$1" | docker compose -f "$COMPOSE_FILE" exec -T db sh -c \
  'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"'

echo "Restore completed from: $1"
