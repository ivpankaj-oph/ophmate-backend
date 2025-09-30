import { Queue } from "bullmq";

export const eventsQueue = new Queue("events", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
