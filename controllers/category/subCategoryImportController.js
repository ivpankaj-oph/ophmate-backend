// controllers/subCategoryImportController.js
import fs from "fs";
import csv from "csv-parser";
import slugify from "slugify";
import { Category, SubCategory } from "../../models/index.js";

export const importSubCategories = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "CSV file is required" });
    }

    const filePath = req.file.path;
    const subcategories = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.name && row.category_name && row.image_url) {
          subcategories.push({
            name: row.name.trim(),
            slug: slugify(row.name, { lower: true, strict: true }),
            description: row.description || "",
            image_url: row.image_url,
            category_name: row.category_name.trim(),
          });
        }
      })
      .on("end", async () => {
        let inserted = 0;
        let skipped = 0;

        for (const sub of subcategories) {
          const category = await Category.findOne({ where: { name: sub.category_name } });
          if (!category) {
            console.warn(`⚠️ Skipped: Category not found for ${sub.name}`);
            skipped++;
            continue;
          }

          const exists = await SubCategory.findOne({ where: { name: sub.name } });
          if (!exists) {
            await SubCategory.create({
              name: sub.name,
              slug: sub.slug,
              description: sub.description,
              image_url: sub.image_url,
              category_id: category.id,
            });
            inserted++;
          } else {
            skipped++;
          }
        }

        fs.unlinkSync(filePath);

        res.status(201).json({
          success: true,
          message: "SubCategories imported successfully",
          total: subcategories.length,
          inserted,
          skipped,
        });
      });
  } catch (err) {
    console.error("❌ [importSubCategories] Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error", error: err.message });
  }
};
