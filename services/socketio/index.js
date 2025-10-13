import { Server as SocketIOServer } from "socket.io";
// import redisClient, { redisSubscriber } from "../redis/index.js";
import { decodeToken } from "../jwt/index.js";
// import { getSuperAdminId } from "../../functions/index.js";
import { ADMIN_NOTIFICATION_SOCKET } from "../../config/variables.js";

let io;

export const initSocketServer = async (httpServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", async (socket) => {
    try {
      const token = socket.handshake.headers.authorization;
      if (!token) {
        console.log("No token provided, disconnecting");
        socket.disconnect();
        return;
      }

      const decoded = decodeToken(token);
      const user_id = decoded.user_id;
      if (!user_id) {
        console.log("Invalid token, disconnecting");
        socket.disconnect();
        return;
      }
      // await redisClient.set(`socket:${user_id}`, socket.id, { EX: 3600 });
      console.log(`User ${user_id} connected with socket ${socket.id}`);
      socket.on("disconnect", async () => {
        // await redisClient.del(`socket:${user_id}`);
      });
    } catch (error) {
      socket.disconnect();
    }
  });

  // await redisSubscriber.subscribe("events", async (message) => {
  //   try {
  //     const data = JSON.parse(message);

  //     const { user_ids, event, payload } = data;

  //     for (const userId of user_ids) {
  //       const socketId = await redisClient.get(`socket:${userId}`);
  //       if (socketId) {
  //         io.to(socketId).emit(event, payload);
  //       } else {
  //         console.log(`No active socket found for user ${userId}`);
  //       }
  //     }
  //   } catch (err) {
  //     console.error("Failed to emit event from Redis:", err);
  //   }
  // });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// export const send_event = async ({ user_ids, room, event, payload }) => {
//   try {
//     const io = getIO();
//     if (!io) {
//       throw new Error("Socket.io not initialized!");
//     }
//     if (user_ids && user_ids.length > 0) {
//       for (const userId of user_ids) {
//         const socketId = await redisClient.get(`socket:${userId}`);

//         if (socketId) {
//           io.to(socketId).emit(event, payload);
//         } else {
//           console.warn(`No socket found for userId: ${userId}`);
//         }
//       }
//     }

//     if (room) {
//       io.to(room).emit(event, payload);
//     }
//   } catch (error) {
//     throw new Error(`Something went wrong in send_event: ${error.message}`);
//   }
// };

// export const send_event_to_admin = async ({ message }) => {
//   console.log("ghjkl", message);
//   try {
//     const admin_id = await getSuperAdminId();
//     if (!admin_id) return;

//     await send_event({
//       user_ids: [admin_id],
//       event: ADMIN_NOTIFICATION_SOCKET,
//       payload: message,
//     });
//   } catch (err) {
//     console.error("Failed to send event to admin:", err);
//   }
// };
