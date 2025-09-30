import { connectDB } from "../../database/database.js";
import "./adminEventWorker.js";
import "./eventsWorker.js";


await connectDB();
console.log("Both workers are running...");
