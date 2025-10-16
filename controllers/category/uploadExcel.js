import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";
import slugify from "slugify";
import sequelize from "../../services/database/database.js";
import { Op } from "sequelize";
import { Category, SubCategory } from "../../models/index.js";

const upload = multer({ dest: "uploads/" }).single("file");

export const uploadCategoriesExcel = [
  upload,
  async (req, res) => {
    try {
      if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });

      const workbook = XLSX.readFile(req.file.path);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet);

      for (const row of rows) {
        const categoryName = row.CategoryName?.trim();
        if (!categoryName) continue;

        const categorySlug = slugify(categoryName, { lower: true });

        // ✅ Case-insensitive lookup using Op.iLike
        let category = await Category.findOne({
          where: { name: { [Op.iLike]: categoryName } },
        });

        if (!category) {
          category = await Category.create({
            name: categoryName,
            slug: categorySlug,
            description: row.CategoryDesc || "",
            image_url: row.Image || null,
          });
        }

        if (!category) {
          console.warn(`⚠️ Could not resolve category for: ${categoryName}`);
          continue;
        }

        const subCategoryName = row.SubCategoryName?.trim();
        if (subCategoryName) {
          const subSlug = slugify(subCategoryName, { lower: true });

          const subExists = await SubCategory.findOne({
            where: {
              slug: subSlug,
              category_id: category.id,
            },
          });

          if (!subExists) {
            await SubCategory.create({
              category_id: category.id,
              name: subCategoryName,
              slug: subSlug,
              description: row.SubCategoryDesc || "",
              image_url: row.SubCategoryImage || null,
            });
          }
        }
      }

      fs.unlinkSync(req.file.path);
      res
        .status(200)
        .json({ success: true, message: "Categories imported successfully" });
    } catch (err) {
      console.error("❌ Excel import error:", err);
      res.status(500).json({ message: err.message });
    }
  },
];
