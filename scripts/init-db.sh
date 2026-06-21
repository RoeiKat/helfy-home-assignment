#!/bin/sh
set -e

DB_HOST="${DB_HOST:-tidb}"
DB_PORT="${DB_PORT:-4000}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"

MYSQL_CMD="mysql -h ${DB_HOST} -P ${DB_PORT} -u ${DB_USER}"

if [ -n "$DB_PASSWORD" ]; then
  MYSQL_CMD="$MYSQL_CMD -p${DB_PASSWORD}"
fi

echo "Waiting for TiDB at ${DB_HOST}:${DB_PORT}..."

until $MYSQL_CMD -e "SELECT 1" >/dev/null 2>&1; do
  echo "TiDB is not ready yet, Retrying"
  sleep 2
done

echo "TiDB is ready. Running schema and seed files."

$MYSQL_CMD < /docker-entrypoint-initdb.d/schema.sql
$MYSQL_CMD < /docker-entrypoint-initdb.d/seed.sql

echo "Database initialized successfully."