import mongoose from "mongoose";
import { MONGODB_URL } from "../../config/variables.js";
import { createSuperAdmin } from "../../functions/index.js";

export const connectDB = async() =>{
    await mongoose.connect(MONGODB_URL).then(async()=>{
        console.log('MongoDB connected successfully')
        await createSuperAdmin()
    }).catch((err)=>{
        console.error(err)
        process.exit(1);
    })
}

export const closeDB = async(signal) => {
  try {
    await mongoose.connection.close();
    console.log(`MongoDB connection closed due to ${signal}`);
    process.exit(0);
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
    process.exit(1);
  }
}