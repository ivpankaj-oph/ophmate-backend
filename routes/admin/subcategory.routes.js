import express from "express";
import { createSubCategory, deleteSubCategory, getAllSubCategories, getSubCategoriesByCategory, updateSubCategory } from "../../controllers/category/subcategory.controller.js";
import { uploadSubCategoryImage } from "../../middleware/uploadSubCategoryImage.js";
import { importSubCategories } from "../../controllers/category/subCategoryImportController.js";
import { uploadCSV } from "../../middleware/upload.middleware.js";


const router = express.Router();

// CREATE
router.post("/create", uploadSubCategoryImage.single("image"), createSubCategory);

// READ
router.get("/", getAllSubCategories);
router.get("/category/:category_id", getSubCategoriesByCategory);

// UPDATE
router.put("/:id", updateSubCategory);

// DELETE
router.delete("/:id", deleteSubCategory);

router.post("/import", uploadCSV.single("file"), importSubCategories);

export default router;
