import { Product, Vendor } from "../models/index.js";

/**
 * @desc Create a new product
 * @route POST /api/products
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      category,
      image_url,
      vendor_id,
    } = req.body;

    // Basic validation
    if (!name || !price || !vendor_id) {
      return res
        .status(400)
        .json({ message: "Product name, price, and vendor_id are required" });
    }

    // Verify that vendor exists
    const vendor = await Vendor.findByPk(vendor_id);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
      image_url,
      vendor_id,
    });

    return res
      .status(201)
      .json({ message: "Product created successfully", product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all products (with pagination + optional filters)
 * @route GET /api/products
 */
export const getProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const where = {};
    if (req.query.category) where.category = req.query.category;
    if (req.query.vendor_id) where.vendor_id = req.query.vendor_id;
    if (req.query.active) where.is_active = req.query.active === "true";

    const { rows: products, count } = await Product.findAndCountAll({
      where,
      include: [{ model: Vendor, attributes: ["id", "business_name", "email"] }],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single product by ID
 * @route GET /api/products/:id
 */
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Vendor, attributes: ["id", "business_name", "email"] }],
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update product by ID
 * @route PUT /api/products/:id
 */
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.update(req.body);
    return res
      .status(200)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete product by ID
 * @route DELETE /api/products/:id
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.destroy();
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Toggle product active status (soft delete)
 * @route PATCH /api/products/:id/toggle
 */
export const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.is_active = !product.is_active;
    await product.save();

    return res.status(200).json({
      message: `Product ${
        product.is_active ? "activated" : "deactivated"
      } successfully`,
      product,
    });
  } catch (error) {
    next(error);
  }
};
