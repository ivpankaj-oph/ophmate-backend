import { eventsQueue } from "../queues/eventsQueue.js";


export const sendEventJob = async ({ user_ids, room, event, payload }) => {
  await eventsQueue.add(
    "send-event",
    { user_ids, room, event, payload },
    {
      attempts: 5,
      backoff: { type: "exponential", delay: 1000 },
    }
  );
};
