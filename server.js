import app from "./app.js";
import { connectDB, closeDB } from "./services/database/database.js";
import { connectProducer } from "./services/kafka/producers/producer.js";
import { PORT } from "./config/variables.js";
import { initSocketServer } from "./services/socketio/index.js";
import { createServer } from "http";


async function startServer() {
  await connectDB();
  await connectProducer();
  const httpServer = createServer(app);

  initSocketServer(httpServer);
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, () => closeDB(signal));
  });
}

startServer();
