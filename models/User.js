import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone_number: {
      type: Number,
      unique: true,
      sparse: true,
    },
    user_type: {
      type: String,
    },
    profileCompleted: { type: Boolean, default: false },
    password: {
      type: String,
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
