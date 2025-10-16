import slugify from "slugify";
import { Category, SubCategory } from "../../models/index.js";


export const createCategory = async (req, res) => {
  try {
    console.log("🟢 [createCategory] Incoming body:", req.body);
    console.log("📸 [createCategory] Uploaded file:", req.file);
    console.log("🧑‍💻 [createCategory] User:", req.user);

    let { name, description, meta_title, meta_description, meta_keywords } = req.body;

    // ✅ Validate required fields
    if (!name || !description || !meta_title || !meta_description || !meta_keywords) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Validate image upload
    if (!req.file) {
      return res.status(400).json({ message: "Category image is required" });
    }

    name = name.trim();
    const slug = slugify(name, { lower: true, strict: true });

    console.log("🔍 Checking existing category:", name);
    const exists = await Category.findOne({ where: { name } });
    if (exists) {
      console.warn(`🚫 Category already exists: ${name}`);
      return res.status(400).json({ message: "Category already exists" });
    }

    const image_url = `/uploads/categories/${req.file.filename}`;

    console.log("🛠️ Creating category...");
    const category = await Category.create({
      name,
      slug,
      description,
      image_url,
      meta_title,
      meta_description,
      meta_keywords,
      created_by: req.user?.user_id || null,
    });

    console.log("✅ Category created successfully:", category.toJSON());
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (err) {
    console.error("❌ [createCategory] Error:", err);
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({ message: "Category already exists (unique constraint)" });
    }
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: SubCategory, as: "subcategories" }],
      order: [["display_order", "ASC"]],
    });
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Category.update(req.body, { where: { id } });
    if (!updated[0]) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ success: true, message: "Category updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Category.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
