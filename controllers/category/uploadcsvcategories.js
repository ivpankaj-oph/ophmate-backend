import fs from "fs";
import csv from "csv-parser";
import slugify from "slugify";
import { Category } from "../../models/index.js";

/**
 * POST /api/category/import
 * Upload and import categories from CSV
 */
export const importCategories = async (req, res) => {
  try {
    console.log("📁 [importCategories] File uploaded:", req.file?.path);

    if (!req.file) {
      return res.status(400).json({ message: "CSV file is required" });
    }

    const filePath = req.file.path;
    const categories = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        if (row.name) {
          categories.push({
            name: row.name.trim(),
            slug: slugify(row.name, { lower: true, strict: true }),
            description: row.description || "",
            meta_title: row.meta_title || "",
            meta_description: row.meta_description || "",
            meta_keywords: row.meta_keywords || "",
            image_url: "/uploads/categories/default.jpg",
          });
        }
      })
      .on("end", async () => {
        
        let inserted = 0;
        for (const cat of categories) {
          const exists = await Category.findOne({ where: { name: cat.name } });
          if (!exists) {
            await Category.create(cat);
            inserted++;
          }
        }

        fs.unlinkSync(filePath);

        res.status(201).json({
          success: true,
          message: `Categories imported successfully`,
          total: categories.length,
          inserted,
        });
      });
  } catch (err) {
    console.error("❌ [importCategories] Error:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};
