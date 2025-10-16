import express from "express";
import { verifyAdmin, verifyToken } from "../../services/jwt/index.js";
import { deleteVendor, getAdminDashboard, getAdminProfile, getAllVendors, getUnverifiedVendors, getVendorDetailsById, getVerifiedVendors, loginAdmin, rejectVendor, verifyVendor } from "../../controllers/admin.controller.js";



const router = express.Router();

router.post("/login", loginAdmin);

router.use(verifyToken, verifyAdmin);

router.get("/profile", getAdminProfile);

router.get("/vendors", getAllVendors);
router.get("/dashboard", getAdminDashboard);
// Get verified vendors
router.get("/vendors/verified", getVerifiedVendors);

// Get unverified vendors
router.get("/vendors/unverified", getUnverifiedVendors);

// Verify vendor
router.put("/vendors/verify/:vendorId", verifyVendor);

// Reject / deactivate vendor
router.put("/vendors/reject/:vendorId", rejectVendor);
router.delete("/vendors/delete/:vendorId", deleteVendor);
router.get("/vendors/:vendorId",  getVendorDetailsById);

export default router;