import { eventsQueue } from "./eventsQueue.js";

export const sendEventJob = async ({ userId, payload }) => {
  await eventsQueue.add(
    "send-event", 
    { userId, payload }, 
    {
      attempts: 5,
      backoff: { type: "exponential", delay: 1000 },
    }
  );
};