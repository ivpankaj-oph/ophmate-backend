import multer from "multer";
import fs from "fs";
import path from "path";

// Define base upload paths
const productUploadPath = path.join(process.cwd(), "uploads", "products", "category");
const categoryUploadPath = path.join(process.cwd(), "uploads", "category");
const csvUploadPath = path.join(process.cwd(), "uploads", "csv");

// Ensure all folders exist
[productUploadPath, categoryUploadPath, csvUploadPath].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Shared file filter for images/videos
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image/video files are allowed"), false);
  }
};

// Storage for product media
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, productUploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

// ✅ Storage for category images
const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, categoryUploadPath),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = `${file.fieldname}-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, safeName);
  },
});

// Storage for CSV files
const csvStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, csvUploadPath),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// CSV file filter
const csvFileFilter = (req, file, cb) => {
  if (path.extname(file.originalname).toLowerCase() !== ".csv") {
    return cb(new Error("Only CSV files are allowed!"), false);
  }
  cb(null, true);
};

// ✅ Exports
export const uploadProductMedia = multer({
  storage: productStorage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadCategoryImage = multer({
  storage: categoryStorage, // ✅ uses the correct category path
  fileFilter,
});

export const uploadCSV = multer({
  storage: csvStorage,
  fileFilter: csvFileFilter,
});
