#!/bin/sh
set -e

PD_ADDR="${PD_ADDR:-http://pd:2379}"
KAFKA_BROKER="${KAFKA_BROKER:-kafka:9092}"
KAFKA_TOPIC="${KAFKA_TOPIC:-tidb-cdc-events}"
CHANGEFEED_ID="${CHANGEFEED_ID:-helfy-assignment-changefeed}"

SINK_URI="kafka://${KAFKA_BROKER}/${KAFKA_TOPIC}?protocol=canal-json&partition-num=1&replication-factor=1"

echo "Waiting for TiCDC to be ready."

until /cdc cli capture list --pd="${PD_ADDR}" >/dev/null 2>&1; do
  echo "TiCDC is not ready yet, Retrying."
  sleep 2
done

echo "TiCDC is ready."

echo "Checking if changefeed '${CHANGEFEED_ID}' already exists."

if /cdc cli changefeed query --pd="${PD_ADDR}" --changefeed-id="${CHANGEFEED_ID}" >/dev/null 2>&1; then
  echo "Changefeed '${CHANGEFEED_ID}' already exists."
else
  echo "Creating changefeed '${CHANGEFEED_ID}'."
  echo "Sink URI: ${SINK_URI}"

  until /cdc cli changefeed create \
    --pd="${PD_ADDR}" \
    --changefeed-id="${CHANGEFEED_ID}" \
    --sink-uri="${SINK_URI}"; do

    echo "Failed to create changefeed. Kafka may not be ready yet. Retrying in 5 seconds."
    sleep 5
  done

  echo "Changefeed created successfully."
fi

echo "Current changefeeds:"
/cdc cli changefeed list --pd="${PD_ADDR}"