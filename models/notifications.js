import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: { type: String },
    message: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notifications = mongoose.model("Notifications", notificationSchema);

export default Notifications;
