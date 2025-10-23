import express from "express";
import {
  updatePersonalDetails,
  updateBusinessDetails,
  forgotPassword,
  loginVendor,
  sendPhoneOtp,
  verifyPhoneOtp,
  getVendorProfile,
  getVendorDashboard,
  sendEmailOtp,
  verifyEmailOtp,
} from "../../controllers/vendor.controller.js";
import { verifyToken, verifyVendor } from "../../services/jwt/index.js";
import { getAllCategories } from "../../controllers/category/category.controller.js";
import { upload } from "../../middleware/upload.middleware.js";

const router = express.Router();

router.post("/send-otp", sendPhoneOtp);
router.post("/verify-otp", verifyPhoneOtp);

router.use(verifyToken, verifyVendor);
// Details update (protected)


router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);

router.put("/personal", updatePersonalDetails);

router.put("/business", upload.fields([
    { name: "gst_cert", maxCount: 1 },
    { name: "pan_card", maxCount: 1 },
  ]), updateBusinessDetails);

router.get("/profile", getVendorProfile);
// Login / Password
router.post("/login", loginVendor);
router.post("/forgot-password", forgotPassword);
router.get("/get-category", getAllCategories);

router.get("/dashboard", getVendorDashboard);
export default router;
