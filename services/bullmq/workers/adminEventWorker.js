import { Worker } from "bullmq";
import { getSuperAdminId } from "../../../functions/index.js";
import { redisPublisher } from "../../redis/index.js";
import { ADMIN_NOTIFICATION_SOCKET } from "../../../config/variables.js";

const worker = new Worker(
  "admin-events",
  async (job) => {
    const { message, msg } = job.data;
    const finalMessage = message || msg;
    console.log("assad", message);

    const admin_id = await getSuperAdminId();
    if (!admin_id) {
      throw new Error("No admin found");
    }

    await redisPublisher.publish(
      "events",
      JSON.stringify({
        user_ids: [admin_id],
        event: ADMIN_NOTIFICATION_SOCKET,
        payload: finalMessage,
      })
    );

    console.log("Event published to Redis for admin:", admin_id);

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
  console.log(`Admin event job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Admin event job ${job.id} failed: ${err.message}`);
});
