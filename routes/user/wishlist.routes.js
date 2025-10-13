import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  moveToCart,
} from "../../controllers/wishlist.controller.js";
import { verifyToken, verifyUser } from "../../services/jwt/index.js";

const router = express.Router();

router.use(verifyToken,verifyUser)

router.post("/", addToWishlist);
router.get("/", getWishlist);
router.delete("/:wishlist_id", removeFromWishlist);
router.post("/move-to-cart/:wishlist_id", moveToCart);

export default router;
