
import { User, Vendor, Product, Order } from "../models/index.js";
import { comparePassword, hashedPassword } from "../functions/index.js";
import { encodeToken } from "../services/jwt/index.js";

/**
 * Creates a default admin user if none exists.
 * @param {Model} User - Sequelize User model
 */
export const createAdminUser = async () => {
  try {
    const adminEmail = "pankaj@oph.com";

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });
    if (existingAdmin) {
      console.log("✅ Admin user already exists");
      return;
    }

    const hashPassword = await hashedPassword("pankajverma");

    await User.create({
      name: "Super Admin",
      email: adminEmail,
      phone: "9999999999",
      password: hashPassword,
      role: "admin",
      is_active: true,
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
    });

    console.log("🎉 Default admin user created successfully!");
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // 2️⃣ Try finding the user (admin) or vendor by email
    let user = await User.findOne({ where: { email } });
    let isVendor = false;

    if (!user) {
      const vendor = await Vendor.findOne({ where: { email } });
      if (!vendor) {
        return res
          .status(404)
          .json({ message: "No admin or vendor found with this email" });
      }
      user = vendor;
      isVendor = true;
    }

    // 3️⃣ Check role permissions
    if (!isVendor && user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only admin or vendor can login." });
    }

    // 4️⃣ Validate password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 5️⃣ Generate token
    const token = await encodeToken({
      user_id: user.id,
      role: isVendor ? "vendor" : user.role,
    });

    // 6️⃣ Send response
    res.status(200).json({
      success: true,
      message: `${isVendor ? "Vendor" : "Admin"} login successful`,
      token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: isVendor ? "vendor" : user.role,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



export const getAdminProfile = async (req, res) => {
  try {
    console.log("🔍 Fetching admin profile for user ID:", req);
    const adminId = req.user.user_id;

    const admin = await User.findOne({
      where: { id: adminId, role: "admin" },
      attributes: {
        exclude: ["password"],
      },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin profile fetched successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getAllVendors = async (req, res) => {
  try {
    console.log("📦 Fetching all vendors...");
    const vendors = await Vendor.findAll({ order: [["createdAt", "DESC"]] });

    res.status(200).json({
      message: "All vendors fetched successfully",
      total: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error("💥 getAllVendors error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * ✅ Get all verified vendors
 */
export const getVerifiedVendors = async (req, res) => {
  try {
    console.log("✅ Fetching verified vendors...");
    const vendors = await Vendor.findAll({
      where: { is_verified: true },
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json({
      message: "Verified vendors fetched successfully",
      total: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error("💥 getVerifiedVendors error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 🚫 Get all unverified vendors
 */
export const getUnverifiedVendors = async (req, res) => {
  try {
    console.log("🚫 Fetching unverified vendors...");
    const vendors = await Vendor.findAll({
      where: { is_verified: false },
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json({
      message: "Unverified vendors fetched successfully",
      total: vendors.length,
      vendors,
    });
  } catch (error) {
    console.error("💥 getUnverifiedVendors error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const verifyVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    console.log("🟢 Verifying vendor:", vendorId);

    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await vendor.update({ is_verified: true, is_active: true });

    res.status(200).json({
      message: "Vendor verified successfully",
      vendor,
    });
  } catch (error) {
    console.error("💥 verifyVendor error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 🔴 Reject / Deactivate vendor
 */
export const rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    console.log("🔴 Rejecting vendor:", vendorId);

    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await vendor.update({ is_verified: false, is_active: false });

    res.status(200).json({
      message: "Vendor rejected / deactivated successfully",
      vendor,
    });
  } catch (error) {
    console.error("💥 rejectVendor error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    console.log("🗑️ Deleting vendor:", vendorId);

    // Find the vendor
    const vendor = await Vendor.findByPk(vendorId);
    if (!vendor) {
      console.warn(`⚠️ Vendor not found for ID: ${vendorId}`);
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Delete vendor permanently
    await vendor.destroy();

    console.log(`✅ Vendor deleted successfully: ${vendorId}`);
    res.status(200).json({
      message: "Vendor deleted successfully",
      vendorId,
    });
  } catch (error) {
    console.error("💥 deleteVendor error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getVendorDetailsById = async (req, res) => {
  try {
    const { vendorId } = req.params;
    console.log("🕵️‍♂️ Admin fetching vendor details:", vendorId);

    const vendor = await Vendor.findByPk(vendorId);

    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.status(200).json({
      message: "Vendor details fetched successfully",
      vendor,
    });
  } catch (error) {
    console.error("💥 getVendorDetailsById error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

