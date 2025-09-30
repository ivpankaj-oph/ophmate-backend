import KafkaPkg from "kafkajs";
const { Kafka } = KafkaPkg;

import { KAFKA_CLIENT_ID } from "../../../config/variables.js";
import { sendMail } from "../../mailing/mail.js";


const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: ["localhost:9092"],
});


const consumer = kafka.consumer({ groupId: "email-group" }); 


const runEmailConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "send-mail", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { email, subject, body } = JSON.parse(message.value.toString());
      console.log("📩 Sending email to:", email);
      await sendMail(email, subject, body);
      console.log("✅ Email sent to", email);
    },
  });
};

export default runEmailConsumer;
