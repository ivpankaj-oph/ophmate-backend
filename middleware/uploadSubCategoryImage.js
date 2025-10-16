// middleware/uploadSubCategoryImage.js
import multer from "multer";
import fs from "fs";
import path from "path";

const baseUploadPath = path.join(process.cwd(), "uploads", "subcategory");
if (!fs.existsSync(baseUploadPath)) fs.mkdirSync(baseUploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, baseUploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = "subcategory-" + Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, safeName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [".jpg", ".jpeg", ".png", ".webp"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only .jpg, .jpeg, .png, .webp files are allowed"), false);
  }
};

export const uploadSubCategoryImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});
