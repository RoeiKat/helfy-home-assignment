require("dotenv").config();

const { Kafka } = require("kafkajs");
const logger = require("./logger");

const kafkaBroker = process.env.KAFKA_BROKER || "kafka:9092";
const kafkaTopic = process.env.KAFKA_TOPIC || "tidb-cdc-events";

const kafka = new Kafka({
  clientId: "helfy-cdc-consumer",
  brokers: [kafkaBroker],
});

const consumer = kafka.consumer({
  groupId: "helfy-cdc-consumer-group",
});

async function startConsumer() {
  await consumer.connect();

  logger.info({
    timestamp: new Date().toISOString(),
    service: "consumer",
    action: "kafka_consumer_connected",
    broker: kafkaBroker,
  });

  await consumer.subscribe({
    topic: kafkaTopic,
    fromBeginning: true,
  });

  logger.info({
    timestamp: new Date().toISOString(),
    service: "consumer",
    action: "kafka_topic_subscribed",
    topic: kafkaTopic,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const rawValue = message.value ? message.value.toString() : null;

      let parsedValue = rawValue;

      try {
        parsedValue = JSON.parse(rawValue);
      } catch {}

      logger.info({
        timestamp: new Date().toISOString(),
        service: "consumer",
        action: "database_change_message_received",
        topic,
        partition,
        offset: message.offset,
        message: parsedValue,
      });
    },
  });
}

startConsumer().catch((error) => {
  logger.error({
    timestamp: new Date().toISOString(),
    service: "consumer",
    action: "kafka_consumer_failed",
    error: error.message,
  });

  process.exit(1);
});