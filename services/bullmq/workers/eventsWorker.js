// workers/eventWorker.js
import { Worker } from "bullmq";
import redisClient from "../../redis/index.js";

const worker = new Worker(
  "events",
  async (job) => {
    const { user_ids, event, payload } = job.data;

    await redisClient.publish(
      "events",
      JSON.stringify({
        user_ids: [user_ids],
        event: event,
        payload: payload,
      })
    );
    return true;
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log(`Event job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Event job ${job.id} failed: ${err.message}`);
});
