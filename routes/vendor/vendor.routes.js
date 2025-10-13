import express from "express";
import {
  updatePersonalDetails,
  updateBusinessDetails,
  forgotPassword,
  loginVendor,
  sendPhoneOtp,
  verifyPhoneOtp,
  getVendorProfile,
} from "../../controllers/vendor.controller.js";
import { verifyToken, verifyVendor } from "../../services/jwt/index.js";
import { getAllCategories, getCategoryById } from "../../controllers/category.controller.js";

const router = express.Router();

router.post("/send-otp", sendPhoneOtp);
router.post("/verify-otp", verifyPhoneOtp);

router.use(verifyToken,verifyVendor);
// Details update (protected)
router.put("/personal", updatePersonalDetails);
router.put("/business", updateBusinessDetails);

router.get("/profile", getVendorProfile);
// Login / Password
router.post("/login", loginVendor);
router.post("/forgot-password", forgotPassword);
router.get("/get-category", getAllCategories);
router.get("/get-category/:id", getCategoryById);

export default router;
