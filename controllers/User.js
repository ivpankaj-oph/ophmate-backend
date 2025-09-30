import {
  comparePassword,
  createNotification,
  generateOtp,
  hashedPassword,
} from "../functions/index.js";
import User from "../models/User.js";
import { sendAdminEventJob } from "../services/bullmq/jobs/sendAdminEventJob.js";
import { encodeToken } from "../services/jwt/index.js";
import { sendMessage } from "../services/kafka/producers/producer.js";
import validator from "validator";

export const userRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email is invalid" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
        existingUser.otp = generateOtp();
        existingUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await existingUser.save();

        return res.status(200).json({
          message:
            "OTP resent to your email. Please verify to complete registration.",
        });
      } else {
        return res.status(400).json({ error: "User already exists" });
      }
    }

    const hashed = await hashedPassword(password);
    const otp = generateOtp();
    const user = new User({
      email,
      password: hashed,
      user_type: "student",
      otp,
      otpExpires: new Date(Date.now() + 10 * 60 * 1000),
    });
    await user.save();

    sendMessage("send-mail", {
      email,
      subject: `Welcome to our app, ${email}! 🎉`,
      body: `
    Hi ${email},

    Thanks for registering! 
    
    Your OTP is: ${otp}
    It will expire in 10 minutes.

    Please use this OTP to verify your account.
  `,
    });

    await sendAdminEventJob({
      message: `A user with email ${user.email} registered!`,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User does not exist" });
    }

    if (!user.isVerified) {
      return res
        .status(401)
        .json({ error: "User is not verified. Please verify your account." });
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = encodeToken({
      user_id: user._id,
      user_type: user.user_type,
    });

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ error: "User already verified" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res
        .status(400)
        .json({ error: "OTP expired. Please register again" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    const nameForEmail = user.full_name || "User";
    await user.save();
    sendMessage("send-mail", {
      email: user.email,
      subject: `OTP Verified Successfully, ${nameForEmail}! 🎉`,
      body: `Hi ${nameForEmail}, your otp verification completed successfully!`,
    }).catch((err) => console.error("Kafka error:", err));
    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const completeProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) return res.status(404).json({ message: "Token not found" });

    const { full_name, phone_number } = req.body;
    if (!full_name && !phone_number)
      return res.status(400).json({ error: "At least one field is required" });

    if (phone_number) {
      const phoneStr = String(phone_number);
      if (!validator.isMobilePhone(phoneStr)) {
        return res.status(400).json({ error: "Invalid Phone Number" });
      }
      const phone_already_exists = await User.findOne({ phone_number });
      if (phone_already_exists) {
        return res.status(409).json({ error: "Phone number already exists" });
      }
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (full_name) user.full_name = full_name;
    if (phone_number) user.phone_number = phone_number;
    user.profileCompleted = true;

    await user.save();

    const nameForEmail = full_name || user.full_name || "User";
    sendMessage("send-mail", {
      email: user.email,
      subject: `Profile completed successfully, ${nameForEmail}! 🎉`,
      body: `Hi ${nameForEmail}, your profile has been completed successfully!`,
    }).catch((err) => console.error("Kafka error:", err));

    await createNotification({
      user_id: user._id,
      type: "info",
      message: "Thanks for registering",
    });
    res.status(200).json({ message: "Profile completed successfully" });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.phone_number) {
      return res.status(409).json({ error: "Phone number already exists" });
    }
    res.status(500).json({ error: `Server error ${error}` });
  }
};
