import express from "express";
import {

  getVendorOrders,
  updateOrderStatus,
} from "../../controllers/vendorOrder.controller.js";
import { verifyToken, verifyVendor } from "../../services/jwt/index.js";

const router = express.Router();

router.use(verifyToken, verifyVendor);

router.get("/get", verifyToken, getVendorOrders);
router.patch("/orders/:orderId/status", verifyToken, updateOrderStatus);


export default router;
