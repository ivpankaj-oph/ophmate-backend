// import multer from "multer";
// import fs from "fs";
// import path from "path";

// // Ensure upload folder exists
// const uploadPath = path.join(process.cwd(), "uploads", "category");
// if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadPath);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
//   },
// });

// // File filter (only images)
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) cb(null, true);
//   else cb(new Error("Only image files are allowed!"), false);
// };

// export const uploadCategoryImage = multer({ storage, fileFilter });


import multer from "multer";
import fs from "fs";
import path from "path";

const baseUploadPath = path.join(process.cwd(), "uploads", "products" ,"category");
if (!fs.existsSync(baseUploadPath)) fs.mkdirSync(baseUploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, baseUploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const safeName = file.fieldname + "-" + Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, safeName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image/video files are allowed"), false);
  }
};

// limits: e.g., 10 MB per file by default (adjust)
export const uploadProductMedia = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });
export const uploadCategoryImage = multer({ storage, fileFilter });
