import express from "express";
import { verifyToken, verifyUser } from "../../services/jwt/index.js";
import { getMyOrders, getOrderById, placeOrder, requestReturn } from "../../controllers/user/order.controller.js";


const router = express.Router();

router.use(verifyUser,verifyToken);

router.post("/place", placeOrder);
router.get("/my", getMyOrders);
router.get("/:orderId", getOrderById);
router.put("/:orderId/return", requestReturn);

export default router;
