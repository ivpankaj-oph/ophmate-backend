import { Queue } from "bullmq";

export const adminEventQueue = new Queue("admin-events", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
