import express from "express";
import {

  updateProduct,
  deleteProduct,
  addOrUpdateVariant,
  adjustStock,
  setPricing,
  previewProduct,
  bulkUploadCsv,
  listVendorProducts,
  getVendorProduct,
  createProductWithVariants,
  getAllProducts,
  getVendorProducts,
} from "../../controllers/product.controller.js";
import multer from "multer";
import { verifyToken, verifyVendor } from "../../services/jwt/index.js";
import {
  uploadProduct,
  uploadProductMedia,
} from "../../middleware/upload.middleware.js";

const router = express.Router();


router.get("/all", getAllProducts);


router.use(verifyToken, verifyVendor);
router.get("/vendor", getVendorProducts);
router.post(
  "/create",
  uploadProduct.fields([
    { name: "images", maxCount: 10 },
    { name: "videos", maxCount: 5 },
  ]),
  createProductWithVariants
);

// update product (upload additional media optionally)
router.put("/:productId", uploadProductMedia.array("media", 10), updateProduct);

// delete product
router.delete("/:productId", deleteProduct);

// list products (vendor)
router.get("/", listVendorProducts);

// get single product
router.get("/:productId", getVendorProduct);

// variants
router.post("/:productId/variant", addOrUpdateVariant); // create variant
router.put("/:productId/variant", addOrUpdateVariant); // update variant (sends id in body)

// inventory
router.post("/:productId/stock", adjustStock);

// pricing
router.post("/:productId/pricing", setPricing);

// preview
router.get("/:productId/preview", previewProduct);

// bulk upload CSV (upload as single 'csv' file)

const csvStorage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(process.cwd(), "uploads", "bulk")),
  filename: (req, file, cb) =>
    cb(null, "bulk-" + Date.now() + "-" + file.originalname),
});
const csvUpload = multer({
  storage: csvStorage,
  fileFilter: (req, file, cb) =>
    file.mimetype === "text/csv" || file.mimetype.includes("excel")
      ? cb(null, true)
      : cb(new Error("CSV only"), false),
});

router.post("/bulk/upload", csvUpload.single("csv"), bulkUploadCsv);

export default router;
