import { Kafka } from "kafkajs";
import { KAFKA_CLIENT_ID } from "../../../config/variables.js";

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: ["localhost:9092"],
});

export const producer = kafka.producer();

export const connectProducer = async () => {
  await producer.connect();
  console.log("Kafka Producer connected");
};

export const sendMessage = async (topic, message) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};
