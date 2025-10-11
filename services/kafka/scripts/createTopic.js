// import KafkaPkg from "kafkajs";
// import { KAFKA_CLIENT_ID } from "../../../config/variables.js";
// const { Kafka } = KafkaPkg;

// const kafka = new Kafka({
//   clientId: KAFKA_CLIENT_ID,
//   brokers: ["localhost:9092"],
// });

// const topics = [
//   { topic: "send-mail", partitions: 3 },
//   { topic: "user-logs", partitions: 2 },
//   { topic: "payment", partitions: 4 },

// ];

// const createTopics = async () => {
//   const admin = kafka.admin();
//   await admin.connect();

//   for (const t of topics) {
//     await admin.createTopics({
//       topics: [
//         {
//           topic: t.topic,
//           numPartitions: t.partitions,
//           replicationFactor: 1,
//         },
//       ],
//     });
//     console.log(`✅ Topic created: ${t.topic}`);
//   }

//   await admin.disconnect();
// };

// createTopics().catch(console.error);
