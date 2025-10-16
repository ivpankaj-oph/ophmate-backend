import express from "express";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} from "../../controllers/category/category.controller.js";

import { verifyAdmin, verifyToken } from "../../services/jwt/index.js";

import { uploadCategoriesExcel } from "../../controllers/category/uploadExcel.js";
import { importCategories } from "../../controllers/category/uploadcsvcategories.js";
import { uploadCategoryImage, uploadCSV } from "../../middleware/upload.middleware.js";

const router = express.Router();

router.use(verifyToken, verifyAdmin);

// Admin protected routes
router.post("/create", uploadCategoryImage.single("image"), createCategory);
router.get("/get-category", getAllCategories);
router.put("/update/:id", updateCategory);
router.delete("/delete/:id", deleteCategory);
router.post("/upload", uploadCategoriesExcel);

router.post("/import", uploadCSV.single("file"), importCategories);
export default router;
