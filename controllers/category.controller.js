import { Category } from "../models/index.js";
import slugify from "slugify";

/**
 * 🟢 Create Category (Admin only)
 */
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    let imagePath = null;

    if (req.file) {
      imagePath = `/uploads/category/${req.file.filename}`;
    }

    const category = await Category.create({
      name,
      description,
      image_url: imagePath,
    });

    res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("💥 createCategory error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 🔵 Get All Categories (Admin + Vendor)
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { is_active: true },
      order: [["name", "ASC"]],
    });

    res.status(200).json({ message: "Categories fetched", categories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 🟣 Get Category by ID
 */
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category fetched", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 🟠 Update Category (Admin only)
 */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, image_url, is_active } = req.body;

    const category = await Category.findByPk(id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    const slug = name ? slugify(name, { lower: true }) : category.slug;

    await category.update({
      name,
      slug,
      description,
      image_url,
      is_active,
    });

    res.status(200).json({ message: "Category updated", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 🔴 Delete Category (Admin only)
 */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    await category.destroy();
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
