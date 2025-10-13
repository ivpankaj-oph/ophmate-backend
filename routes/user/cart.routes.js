import express from "express";
import {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  saveForLater,
} from "../../controllers/cart.controller.js";
import { verifyToken, verifyUser } from "../../services/jwt/index.js";


const router = express.Router();

router.use(verifyToken,verifyUser);

router.post("/add", addToCart);
router.get("/get", getCart);
router.put("/update", updateCartQuantity);
router.delete("/remove/:cart_id", removeFromCart);
router.put("/save/:cart_id", saveForLater);

export default router;
