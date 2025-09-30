import { adminEventQueue } from "../queues/adminEventQueue.js";

export const sendAdminEventJob = async (message) => {
  await adminEventQueue.add(
    "send-admin-event",
    { message },
    {
      attempts: 5,
      backoff: { type: "exponential", delay: 1000 },
    }
  );
};
