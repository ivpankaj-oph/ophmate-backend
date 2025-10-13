import express from "express";
import {
  registerUser,
  loginUser,
  resetPassword,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  addAddress,
  getAllAddresses,
  deleteAddress,
} from "../../controllers/user.controller.js";

import multer from "multer";
import path from "path";
import fs from "fs";
import { verifyToken, verifyUser } from "../../services/jwt/index.js";

const router = express.Router();

const uploadDir = "uploads/users";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `user-${req.user?.id || Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);

router.use(verifyToken, verifyUser);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/profile/photo", upload.single("photo"), uploadProfilePhoto);

router.post("/address", addAddress);
router.get("/address", getAllAddresses);
router.delete("/address/:addressId", deleteAddress);

export default router;
