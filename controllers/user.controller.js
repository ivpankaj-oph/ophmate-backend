// controllers/user.controller.js
import bcrypt from "bcrypt";
import { User } from "../models/index.js";
import { encodeToken } from "../services/jwt/index.js";
import { comparePassword, hashedPassword } from "../functions/index.js";
import multer from "multer";
import path from "path";
import { Address } from "../models/index.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    const hash = await hashedPassword(password);

    const user = await User.create({ name, email, phone, password: hash });

    const token = encodeToken({ id: user.id, role: user.role });

    res.status(201).json({ message: "User registered", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await comparePassword(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = encodeToken({ id: user.id, role: user.role });
    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const hash = await hashedPassword(newPassword);
    await user.update({ password: hash });

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.user; // from JWT middleware
    const user = await User.findByPk(id, { attributes: { exclude: ["password"] } });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const { name, phone, city, state, pincode } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.update({ name, phone, city, state, pincode });

    res.status(200).json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};




const storage = multer.diskStorage({
  destination: "uploads/profile",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


export const upload = multer({ storage });

export const uploadProfilePhoto = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findByPk(id);

    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    await user.update({ profile_photo: `/uploads/profile/${req.file.filename}` });

    res.status(200).json({ message: "Profile photo updated", path: user.profile_photo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const addAddress = async (req, res) => {
  try {
    const { id } = req.user;
    const { label, address_line, city, state, pincode, is_default } = req.body;

    const address = await Address.create({
      user_id: id,
      label,
      address_line,
      city,
      state,
      pincode,
      is_default,
    });

    res.status(201).json({ message: "Address added", address });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getAllAddresses = async (req, res) => {
  try {
    const { id } = req.user;
    const addresses = await Address.findAll({ where: { user_id: id } });

    res.status(200).json({ addresses });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const address = await Address.findByPk(addressId);

    if (!address) return res.status(404).json({ message: "Address not found" });

    await address.destroy();
    res.status(200).json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


