
import bcrypt from "bcrypt";
import { User } from "../models/index.js";

/**
 * @desc Register a new user
 * @route POST /api/users/register
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password, address, city, state, pincode, country, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "Name, email, phone, and password are required" });
    }

    // Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      city,
      state,
      pincode,
      country,
      role,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc User login
 * @route POST /api/users/login
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

    // Later you can add JWT token generation here
    return res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get all users (admin only)
 * @route GET /api/users
 */
export const getUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const { rows: users, count } = await User.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get single user by ID
 * @route GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update user details
 * @route PUT /api/users/:id
 */
export const updateUser = async (req, res, next) => {
  try {
    const { password, ...rest } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (password) {
      rest.password = await bcrypt.hash(password, 10);
    }

    await user.update(rest);
    return res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete user
 * @route DELETE /api/users/:id
 */
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.destroy();
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Toggle active/inactive user
 * @route PATCH /api/users/:id/toggle
 */
export const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.is_active = !user.is_active;
    await user.save();

    return res.status(200).json({
      message: `User ${user.is_active ? "activated" : "deactivated"} successfully`,
      user,
    });
  } catch (error) {
    next(error);
  }
};
