import slugify from "slugify";
import { SubCategory, Category } from "../../models/index.js";

// ✅ Create SubCategory
export const createSubCategory = async (req, res) => {
  try {
    console.log("📤 [createSubCategory] Body:", req.body);
    console.log("🖼️ [createSubCategory] File:", req.file);

    const { name, description, category_name } = req.body;

    if (!name || !category_name) {
      return res.status(400).json({
        success: false,
        message: "Both name and category_name are required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required for subcategory.",
      });
    }

    const category = await Category.findOne({ where: { name: category_name } });
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found." });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const subCategory = await SubCategory.create({
      name,
      slug,
      description,
      image_url: `/uploads/subcategory/${req.file.filename}`,
      category_id: category.id,
    });

    res.status(201).json({
      success: true,
      message: "SubCategory created successfully",
      data: subCategory,
    });
  } catch (err) {
    console.error("❌ [createSubCategory] Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};


export const getAllSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.findAll({
      include: [{ model: Category, as: "category" }],
      order: [["name", "ASC"]],
    });
    res.status(200).json({ success: true, data: subcategories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get SubCategories by Category ID
export const getSubCategoriesByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const subcategories = await SubCategory.findAll({
      where: { category_id },
      order: [["name", "ASC"]],
    });

    res.status(200).json({ success: true, data: subcategories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update SubCategory
export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await SubCategory.update(req.body, { where: { id } });
    if (!updated[0]) return res.status(404).json({ message: "SubCategory not found" });
    res.status(200).json({ success: true, message: "SubCategory updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete SubCategory
export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SubCategory.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "SubCategory not found" });
    res.status(200).json({ success: true, message: "SubCategory deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
