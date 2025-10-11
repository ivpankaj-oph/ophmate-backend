import express from "express";
import {
  createVendor,
  getVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  verifyVendor,
} from "../controllers/vendor.controller.js";

const router = express.Router();

router.post("/create", createVendor);
router.get("/get-all", getVendors);
router.get("/get/:id", getVendorById);
router.put("/update/:id", updateVendor);
router.delete("/delete/:id", deleteVendor);
router.patch("/verify/:id/verify", verifyVendor);

export default router;
