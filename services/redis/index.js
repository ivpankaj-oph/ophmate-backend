
// import { createClient } from "redis";

// export const redisPublisher = createClient({
//   url: "redis://localhost:6379",
// });


// export const redisSubscriber = createClient({
//   url: "redis://localhost:6379",
// });


// const redisClient = createClient({
//   url: "redis://localhost:6379",
// });

// redisPublisher.on("error", (err) => console.log("Redis Publisher Error", err));
// redisSubscriber.on("error", (err) => console.log("Redis Subscriber Error", err));
// redisClient.on("error", (err) => console.log("Redis Client Error", err));

// redisSubscriber.on("ready", () => {
//   console.log("Redis Subscriber connected");
// });

// redisPublisher.on("ready", () => {
//   console.log("Redis Publisher connected");
// });

// redisClient.on("ready", () => {
//   console.log("Redis connected");
// });

// await redisPublisher.connect();
// await redisSubscriber.connect();
// await redisClient.connect();

// export default redisClient;
