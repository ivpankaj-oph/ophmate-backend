import { Vendor } from "../models/index.js";




/**
 * @desc Create a new vendor
 * @route POST /api/vendors
 */
export const createVendor = async (req, res, next) => {
  try {
    const {
      business_name,
      gst_number,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      bank_account,
      ifsc_code,
    } = req.body;

    // Basic validation
    if (!business_name || !email || !phone) {
      return res.status(400).json({ message: "Business name, email, and phone are required" });
    }

    // Check if vendor exists
    const existingVendor = await Vendor.findOne({ where: { email } });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor with this email already exists" });
    }

    const vendor = await Vendor.create({
      business_name,
      gst_number,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      bank_account,
      ifsc_code,
    });

    return res.status(201).json({ message: "Vendor created successfully", vendor });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all vendors (with pagination)
 * @route GET /api/vendors
 */
export const getVendors = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const { rows: vendors, count } = await Vendor.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      vendors,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get a single vendor by ID
 * @route GET /api/vendors/:id
 */
export const getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    return res.status(200).json(vendor);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update vendor by ID
 * @route PUT /api/vendors/:id
 */
export const updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await vendor.update(req.body);
    return res.status(200).json({ message: "Vendor updated successfully", vendor });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete vendor by ID
 * @route DELETE /api/vendors/:id
 */
export const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    await vendor.destroy();
    return res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Verify vendor (admin action)
 * @route PATCH /api/vendors/:id/verify
 */
export const verifyVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByPk(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.is_verified = true;
    await vendor.save();

    return res.status(200).json({ message: "Vendor verified successfully", vendor });
  } catch (error) {
    next(error);
  }
};



