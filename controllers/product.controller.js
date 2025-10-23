import { Product, ProductVariant, Category, Vendor } from "../models/index.js";
import { Op } from "sequelize";
import slugify from "slugify";
// import csv from "csv-parse";
import { parse } from "csv-parse";

import fs from "fs";
import path from "path";
import sequelize from "../services/database/database.js";

/**
 * Helper: compute final price
 */

/**
 * Create product (vendor)
 * Supports multipart form: fields + multiple images/videos uploaded as 'media' or use image_urls in body
 */

export const createProductWithVariants = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      productName,
      productCategory,
      productSubCategory,
      brand,
      short_description,
      description,
      isAvailable,
      variants,
    } = req.body;

    const vendorId = req.user.user_id; // assuming req.user populated from auth middleware

    console.log("asdas", vendorId);
    // Parse variants JSON (required because multipart/form-data sends strings)
    let parsedVariants = [];
    try {
      parsedVariants =
        typeof variants === "string" ? JSON.parse(variants) : variants;
    } catch (err) {
      return res.status(400).json({ message: "Invalid variants JSON" });
    }

    if (
      !productName ||
      !productCategory ||
      !Array.isArray(parsedVariants) ||
      parsedVariants.length === 0
    ) {
      return res.status(400).json({
        message:
          "productName, productCategory, and at least one variant are required",
      });
    }

    // 1️⃣ Generate unique slug
    let slug = slugify(productName, { lower: true, strict: true });
    const exists = await Product.findOne({ where: { slug } });
    if (exists) slug += `-${Date.now()}`;

    const images = [];
    const videos = [];
    if (req.files) {
      console.log(req.files, "🧩 Uploaded files");

      const imageFiles = req.files.images || [];
      const videoFiles = req.files.videos || [];

      imageFiles.forEach((f) =>
        images.push(`/uploads/products/images/${f.filename}`)
      );
      videoFiles.forEach((f) =>
        videos.push(`/uploads/products/videos/${f.filename}`)
      );
    }

    const product = await Product.create(
      {
        productName,
        productCategory,
        productSubCategory,
        brand,
        short_description,
        description,
        isAvailable: isAvailable === "true" || isAvailable === true,
        slug,
        vendor_id: vendorId,
        image_urls: images,
        video_urls: videos,
      },
      { transaction }
    );

    const variantPayloads = parsedVariants.map((v) => {
      const discountPercent = v.discount_percent ?? 0;
      const finalPrice = Number(
        (v.price * (1 - discountPercent / 100)).toFixed(2)
      );

      return {
        product_id: product.id,
        sku: v.sku,
        attributes: v.attributes || {},
        actual_price: v.actual_price ?? v.price,
        price: v.price,
        discount_percent: discountPercent,
        final_price: finalPrice,
        stockQuantity: v.stockQuantity ?? 0,
      };
    });

    await ProductVariant.bulkCreate(variantPayloads, { transaction });

    await transaction.commit();

    return res.status(201).json({
      message: "✅ Product with variants created successfully",
      product,
      variants: variantPayloads,
    });
  } catch (error) {
    await transaction.rollback();
    console.error("❌ createProductWithVariants error:", error);
    res.status(500).json({
      message: "Failed to create product with variants",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: ProductVariant,
          as: "variants",
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"], // ✅ Only get the category name
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!products.length) {
      return res.status(404).json({ message: "No products found" });
    }

    // Optional: clean response (replace category object with category name)
    const formattedProducts = products.map((product) => ({
      ...product.toJSON(),
      productCategory: product.category?.name || null,
    }));

    res.status(200).json({
      message: "✅ Products fetched successfully",
      count: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error) {
    console.error("❌ getAllProducts error:", error);
    res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.user.user_id;

    if (!vendorId) {
      return res.status(401).json({ message: "Unauthorized: Vendor not found" });
    }

    const products = await Product.findAll({
      where: { vendor_id: vendorId },
      include: [
        {
          model: ProductVariant,
          as: "variants",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!products.length) {
      return res.status(404).json({ message: "No products found for this vendor" });
    }

    res.status(200).json({
      message: "✅ Vendor products fetched successfully",
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("❌ getVendorProducts error:", error);
    res.status(500).json({
      message: "Failed to fetch vendor products",
      error: error.message,
    });
  }
};


export const computeFinal = (price, discount) => {
  return Number((price * (1 - (discount || 0) / 100)).toFixed(2));
};



/**
 * Edit product (vendor can edit only own product)
 */
export const updateProduct = async (req, res) => {
  const t = await Product.sequelize.transaction();
  try {
    const vendorId = req.vendor.id;
    const { productId } = req.params;
    const product = await Product.findByPk(productId);

    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.vendor_id !== vendorId) {
      await t.rollback();
      return res.status(403).json({ message: "Not authorized" });
    }

    const updates = {};
    const allowed = [
      "name",
      "short_description",
      "description",
      "base_price",
      "mrp",
      "discount_percent",
      "category_id",
      "subcategory",
      "status",
      "meta",
      "is_active",
    ];
    for (const k of allowed)
      if (req.body[k] !== undefined) updates[k] = req.body[k];

    if (updates.name)
      updates.slug = slugify(updates.name, { lower: true, strict: true });

    if (req.files && req.files.length) {
      // append new media to arrays
      const newImages = [];
      const newVideos = [];
      for (const f of req.files) {
        if (f.mimetype.startsWith("image/"))
          newImages.push(`/uploads/products/${f.filename}`);
        else if (f.mimetype.startsWith("video/"))
          newVideos.push(`/uploads/products/${f.filename}`);
      }
      updates.image_urls = [...(product.image_urls || []), ...newImages];
      updates.video_urls = [...(product.video_urls || []), ...newVideos];
    }

    // recalc final price if base_price/discount_percent present
    if (updates.base_price || updates.discount_percent) {
      const bp =
        updates.base_price !== undefined
          ? Number(updates.base_price)
          : product.base_price;
      const dp =
        updates.discount_percent !== undefined
          ? Number(updates.discount_percent)
          : product.discount_percent;
      updates.final_price = computeFinal(bp, dp);
    }

    await product.update(updates, { transaction: t });
    await t.commit();
    res.status(200).json({ message: "Product updated", product });
  } catch (err) {
    await t.rollback();
    console.error("updateProduct error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Delete product (soft-delete or hard delete based on query param)
 */
export const deleteProduct = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.vendor_id !== vendorId)
      return res.status(403).json({ message: "Not authorized" });

    // soft delete: set is_active=false; or hard delete if ?force=true
    if (req.query.force === "true") {
      await product.destroy();
      return res.status(200).json({ message: "Product permanently deleted" });
    } else {
      await product.update({ is_active: false, status: "inactive" });
      return res.status(200).json({ message: "Product soft-deactivated" });
    }
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Add / update variant
 */
export const addOrUpdateVariant = async (req, res) => {
  const t = await ProductVariant.sequelize.transaction();
  try {
    const vendorId = req.vendor.id;
    const { productId } = req.params;
    const product = await Product.findByPk(productId);
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.vendor_id !== vendorId) {
      await t.rollback();
      return res.status(403).json({ message: "Not authorized" });
    }

    const {
      id,
      sku,
      attributes = {},
      price = 0,
      mrp,
      discount_percent = 0,
      stock = 0,
    } = req.body;

    if (id) {
      // update
      const variant = await ProductVariant.findByPk(id);
      if (!variant) {
        await t.rollback();
        return res.status(404).json({ message: "Variant not found" });
      }
      await variant.update(
        {
          sku,
          attributes,
          price,
          mrp,
          discount_percent,
          final_price: computeFinal(price, discount_percent),
          stock,
        },
        { transaction: t }
      );
      await t.commit();
      return res.status(200).json({ message: "Variant updated", variant });
    } else {
      // create
      const variant = await ProductVariant.create(
        {
          product_id: productId,
          sku,
          attributes,
          price,
          mrp,
          discount_percent,
          final_price: computeFinal(price, discount_percent),
          stock,
        },
        { transaction: t }
      );
      // optionally update product.total stock
      await t.commit();
      return res.status(201).json({ message: "Variant created", variant });
    }
  } catch (err) {
    await t.rollback();
    console.error("addOrUpdateVariant error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Inventory management (stock in/out) for product OR variant
 * body: { type: "in"|"out", qty: number, variantId?: uuid, note?: string }
 */
export const adjustStock = async (req, res) => {
  const t = await Product.sequelize.transaction();
  try {
    const vendorId = req.vendor.id;
    const { productId } = req.params;
    const { type, qty = 0, variantId } = req.body;
    if (!["in", "out"].includes(type)) {
      await t.rollback();
      return res.status(400).json({ message: "type must be 'in' or 'out'" });
    }
    const product = await Product.findByPk(productId, { transaction: t });
    if (!product) {
      await t.rollback();
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.vendor_id !== vendorId) {
      await t.rollback();
      return res.status(403).json({ message: "Not authorized" });
    }

    if (variantId) {
      const variant = await ProductVariant.findByPk(variantId, {
        transaction: t,
      });
      if (!variant) {
        await t.rollback();
        return res.status(404).json({ message: "Variant not found" });
      }
      const newStock =
        type === "in"
          ? variant.stock + Number(qty)
          : variant.stock - Number(qty);
      if (newStock < 0) {
        await t.rollback();
        return res.status(400).json({ message: "Insufficient stock" });
      }
      await variant.update({ stock: newStock }, { transaction: t });
    } else {
      const newStock =
        type === "in"
          ? product.stock + Number(qty)
          : product.stock - Number(qty);
      if (newStock < 0) {
        await t.rollback();
        return res.status(400).json({ message: "Insufficient stock" });
      }
      await product.update({ stock: newStock }, { transaction: t });
    }

    await t.commit();
    return res.status(200).json({ message: "Stock updated" });
  } catch (err) {
    await t.rollback();
    console.error("adjustStock error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Set pricing / discount
 * body: { base_price, discount_percent, mrp } or for variant use variantId
 */
export const setPricing = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { productId } = req.params;
    const { variantId, base_price, discount_percent, mrp } = req.body;
    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.vendor_id !== vendorId)
      return res.status(403).json({ message: "Not authorized" });

    if (variantId) {
      const variant = await ProductVariant.findByPk(variantId);
      if (!variant)
        return res.status(404).json({ message: "Variant not found" });
      const updates = {};
      if (base_price !== undefined) updates.price = Number(base_price);
      if (discount_percent !== undefined)
        updates.discount_percent = Number(discount_percent);
      if (mrp !== undefined) updates.mrp = Number(mrp);
      if (Object.keys(updates).length) {
        if (updates.price || updates.discount_percent)
          updates.final_price = computeFinal(
            updates.price || variant.price,
            updates.discount_percent || variant.discount_percent
          );
        await variant.update(updates);
      }
      return res
        .status(200)
        .json({ message: "Variant pricing updated", variant });
    } else {
      const updates = {};
      if (base_price !== undefined) updates.base_price = Number(base_price);
      if (discount_percent !== undefined)
        updates.discount_percent = Number(discount_percent);
      if (mrp !== undefined) updates.mrp = Number(mrp);
      if (Object.keys(updates).length) {
        if (updates.base_price || updates.discount_percent)
          updates.final_price = computeFinal(
            updates.base_price || product.base_price,
            updates.discount_percent || product.discount_percent
          );
        await product.update(updates);
      }
      return res
        .status(200)
        .json({ message: "Product pricing updated", product });
    }
  } catch (err) {
    console.error("setPricing error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Preview product (not change DB) — returns assembled product object for preview
 * vendor can preview their own product
 */
export const previewProduct = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { productId } = req.params;
    const product = await Product.findByPk(productId, {
      include: [{ model: ProductVariant }],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.vendor_id !== vendorId)
      return res.status(403).json({ message: "Not authorized" });

    // Return product data as it would appear
    res.status(200).json({ message: "Preview", product });
  } catch (err) {
    console.error("previewProduct error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Bulk product upload via CSV
 * Accepts a CSV file uploaded using field 'csv'
 * CSV expected columns: name, short_description, description, base_price, mrp, discount_percent, category_slug, subcategory, sku(optional), stock(optional)
 */
export const bulkUploadCsv = async (req, res) => {
  const t = await Product.sequelize.transaction();
  try {
    if (!req.file) {
      await t.rollback();
      return res.status(400).json({ message: "CSV file not provided" });
    }
    const filePath = req.file.path;
    const parser = fs
      .createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }));

    const vendorId = req.vendor.id;
    const created = [];
    for await (const row of parser) {
      // minimal validation
      const name = row.name;
      const base_price = Number(row.base_price || 0);
      if (!name || !base_price) continue;

      // map category by slug if provided
      let category = null;
      if (row.category_slug) {
        category = await Category.findOne({
          where: { slug: row.category_slug },
        });
      }

      const slug = slugify(name, { lower: true, strict: true });
      const exists = await Product.findOne({ where: { slug } });
      const uniqueSlug = exists ? `${slug}-${Date.now()}` : slug;

      const product = await Product.create(
        {
          vendor_id: vendorId,
          name,
          slug: uniqueSlug,
          short_description: row.short_description || null,
          description: row.description || null,
          base_price,
          mrp: row.mrp ? Number(row.mrp) : null,
          discount_percent: row.discount_percent
            ? Number(row.discount_percent)
            : 0,
          final_price: computeFinal(
            base_price,
            Number(row.discount_percent || 0)
          ),
          category_id: category ? category.id : null,
          subcategory: row.subcategory || null,
          status: "draft",
        },
        { transaction: t }
      );

      // if csv provides SKU/stock -> create a single default variant
      if (row.sku || row.stock) {
        await ProductVariant.create(
          {
            product_id: product.id,
            sku: row.sku || `${product.slug}-default`,
            attributes: {},
            price: product.base_price,
            mrp: product.mrp,
            discount_percent: product.discount_percent,
            final_price: product.final_price,
            stock: row.stock ? Number(row.stock) : 0,
          },
          { transaction: t }
        );
      }

      created.push(product);
    }

    await t.commit();
    // optionally delete the uploaded csv file after processing
    fs.unlinkSync(filePath);

    return res
      .status(201)
      .json({ message: "Bulk upload complete", count: created.length });
  } catch (err) {
    await t.rollback();
    console.error("bulkUploadCsv error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * List vendor products with pagination, search, filters
 */
export const listVendorProducts = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { page = 1, limit = 20, q, status, category_id } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const where = { vendor_id: vendorId };
    if (status) where.status = status;
    if (category_id) where.category_id = category_id;
    if (q)
      where[Op.or] = [
        { name: { [Op.iLike]: `%${q}%` } },
        { short_description: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
      ];

    const { rows, count } = await Product.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [["updatedAt", "DESC"]],
    });

    res
      .status(200)
      .json({
        total: count,
        page: Number(page),
        limit: Number(limit),
        products: rows,
      });
  } catch (err) {
    console.error("listVendorProducts error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

/**
 * Get single product (vendor only)
 */
export const getVendorProduct = async (req, res) => {
  try {
    const vendorId = req.vendor.id;
    const { productId } = req.params;
    const product = await Product.findByPk(productId, {
      include: [{ model: ProductVariant }],
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (product.vendor_id !== vendorId)
      return res.status(403).json({ message: "Not authorized" });

    res.status(200).json({ product });
  } catch (err) {
    console.error("getVendorProduct error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
