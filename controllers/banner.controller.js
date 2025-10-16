import Banner from "../models/banner.model.js";
import fs from "fs";
import path from "path";


export const createBanner = async (req, res) => {
  try {
    const { title, description } = req.body;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "Image is required" });

    const imageUrl = `/uploads/banners/${file.filename}`;

    const banner = await Banner.create({
      title,
      description,
      imageUrl,
    });

    res.status(201).json({ message: "Banner created successfully", banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating banner" });
  }
};

// 📜 Get All Banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({ order: [["createdAt", "DESC"]] });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching banners" });
  }
};

// 🔍 Get Single Banner
export const getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });
    res.json(banner);
  } catch (error) {
    res.status(500).json({ message: "Error fetching banner" });
  }
};

// ✏️ Update Banner
export const updateBanner = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;
    const file = req.file;

    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    let imageUrl = banner.imageUrl;

    if (file) {
      // delete old image
      const oldPath = path.join(process.cwd(), banner.imageUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      imageUrl = `/uploads/banners/${file.filename}`;
    }

    banner.title = title || banner.title;
    banner.description = description || banner.description;
    banner.imageUrl = imageUrl;
    if (isActive !== undefined) banner.isActive = isActive === "true" || isActive === true;

    await banner.save();
    res.json({ message: "Banner updated", banner });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating banner" });
  }
};

// ❌ Delete Banner
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByPk(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    // delete local image file
    const imagePath = path.join(process.cwd(), banner.imageUrl);
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

    await banner.destroy();
    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting banner" });
  }
};
