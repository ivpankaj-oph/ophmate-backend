import multer from "multer";
import fs from "fs";
import path from "path";

// ✅ Base paths
const baseUploadPath = path.join(process.cwd(), "uploads", "products", "category");
const csvUploadPath = path.join(process.cwd(), "uploads", "csv");

// ✅ Ensure upload directories exist
if (!fs.existsSync(baseUploadPath)) fs.mkdirSync(baseUploadPath, { recursive: true });
if (!fs.existsSync(csvUploadPath)) fs.mkdirSync(csvUploadPath, { recursive: true });

// ✅ Storage for images/videos
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, baseUploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

// ✅ File filter for media
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image/video files are allowed"), false);
  }
};

// ✅ Storage for CSV files
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, csvUploadPath),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// ✅ CSV file filter
const csvFileFilter = (req, file, cb) => {
  if (path.extname(file.originalname).toLowerCase() !== ".csv") {
    return cb(new Error("Only CSV files are allowed!"), false);
  }
  cb(null, true);
};

// ✅ Final exports
export const uploadProductMedia = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

export const uploadCategoryImage = multer({
  storage,
  fileFilter,
});

export const uploadCSV = multer({
  storage: csvStorage,
  fileFilter: csvFileFilter,
});
