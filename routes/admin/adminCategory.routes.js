import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../../controllers/category.controller.js";

import { verifyAdmin, verifyToken } from "../../services/jwt/index.js";
import { uploadCategoryImage } from "../../middleware/upload.middleware.js";

const router = express.Router();

router.use(verifyToken, verifyAdmin);

// Admin protected routes
router.post("/create",  uploadCategoryImage.single("image"), createCategory);
router.get("/get-category",  getAllCategories);
router.get("/get-category/:id",  getCategoryById);
router.put("/update/:id",  updateCategory);
router.delete("/delete/:id",  deleteCategory);

export default router;
