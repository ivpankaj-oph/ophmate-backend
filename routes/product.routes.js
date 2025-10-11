import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/product", createProduct);
router.get("/get-all", getProducts);
router.get("/get-product/:id", getProductById);
router.put("/update-product/:id", updateProduct);
router.delete("/delete-product/:id", deleteProduct);
router.patch("/:id/toggle", toggleProductStatus);

export default router;
