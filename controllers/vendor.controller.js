// import { generateOtp, sendOtp } from "../functions/index.js";
import {
  comparePassword,
  generateOtp,
  hashedPassword,
} from "../functions/index.js";
import { Vendor, Product, Order } from "../models/index.js";
import { encodeToken } from "../services/jwt/index.js";

/**
 * @desc Create a new vendor
 * @route POST /api/vendors
 */

const otpStore = new Map();

export const sendPhoneOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone)
      return res.status(400).json({ message: "Phone number required" });

    const otp = generateOtp();
    console.log(`Sending OTP ${otp} to phone ${phone}`);
    otpStore.set(phone, otp);
    res.status(200).json({ message: "OTP sent successfully", otp: otp });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * 2️⃣ Verify OTP and create vendor record (if new)
 */
export const verifyPhoneOtp = async (req, res) => {
  try {
    // console.log("🔍 Incoming verifyPhoneOtp request:", req.body);

    const { phone, otp } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    const storedOtp = otpStore.get(phone);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    otpStore.delete(phone);

    let vendor = await Vendor.findOne({ where: { phone } });
    if (!vendor) {
      vendor = await Vendor.create({ phone });
    } else {
      // console.log("✅ Existing vendor found:", vendor.id);
    }

    const token = encodeToken({ id: vendor.id, role: vendor.role });
    // console.log("🔑 Generated token for vendor:", vendor.id, token);

    res.status(200).json({
      message: "Phone verified successfully",

      token,
    });
  } catch (error) {
    console.error("verifyPhoneOtp error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message || error,
    });
  }
};

/**
 * 3️⃣ Add / Update Personal Details
 */
export const updatePersonalDetails = async (req, res) => {
  try {
    const { id } = req.user; // from auth middleware
    const { email, address, city, state, pincode, password } = req.body;

    const vendor = await Vendor.findByPk(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const updateData = { email, address, city, state, pincode };

    // Only hash and update password if provided
    if (password && password.trim() !== "") {
      const hashpass = await hashedPassword(password);
      updateData.password = hashpass;
    }

    await vendor.update(updateData);

    res.status(200).json({ message: "Personal details updated", vendor });
  } catch (error) {
    console.error("❌ updatePersonalDetails error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 4️⃣ Add / Update Business Details
 */
export const updateBusinessDetails = async (req, res) => {
  try {
    const { id } = req.user;
    const { business_name, gst_number, bank_account, ifsc_code } = req.body;

    const vendor = await Vendor.findByPk(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await vendor.update({
      business_name,
      gst_number,
      bank_account,
      ifsc_code,
      is_profile_completed: true,
      profile_complete_level: 100,
    });

    res.status(200).json({ message: "Business details updated", vendor });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/**
 * 5️⃣ Login with Email/Password
 */
export const loginVendor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const vendor = await Vendor.findOne({ where: { email } });
    console.log("vendor", vendor);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Check if vendor is verified
    if (!vendor.is_verified) {
      return res.status(403).json({
        message: "Vendor not verified. Please complete verification first.",
      });
    }

    // Validate password
    console.log("adfghjkl", vendor.password, password);
    const isMatch = await comparePassword(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = encodeToken({ id: vendor.id, role: vendor.role });

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 6️⃣ Forgot Password / Reset Password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const vendor = await Vendor.findOne({ where: { email } });

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    const hash = await hashedPassword(newPassword);
    await vendor.update({ password: hash });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getVendorProfile = async (req, res) => {
  try {
    const id = req.user.user_id; // Extracted from JWT middleware
    console.log("📄 Fetching vendor profile:", id);

    const user = await Vendor.findByPk(id, {
      attributes: { exclude: ["password"] }, // security best practice
    });

    if (!user) return res.status(404).json({ message: "Vendor not found" });

    res.status(200).json({
      success: true,
      message: "Vendor profile fetched successfully",
      user,
    });
  } catch (error) {
    console.error("💥 getVendorProfile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getVendorDashboard = async (req, res) => {
  try {
    console.log("🔍 Fetching vendor dashboard for user ID:", req.user);
    const vendorId = req.user.id;

    const [totalProducts, totalOrders] = await Promise.all([
      Product.count({ where: { vendor_id: vendorId } }),
      Order.count({ where: { vendor_id: vendorId } }),
    ]);

    const recentOrders = await Order.findAll({
      where: { vendor_id: vendorId },
      limit: 5,
      order: [["createdAt", "DESC"]],
      include: [{ all: true }],
    });
    const totalRevenue = 0
    const totalSales = 0
    res.json({
      success: true,
      message: "Vendor dashboard fetched successfully",
      data: {
        summary: {
          totalProducts,
          totalOrders,
          totalRevenue,
          totalSales,
        },
        recentOrders,
      },
    });
  } catch (error) {
    console.error("❌ Vendor dashboard error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to load vendor dashboard" });
  }
};
