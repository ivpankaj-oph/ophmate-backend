import User from "../models/User.js";
import { decodeToken } from "../services/jwt/index.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = decodeToken(token);

    const user = await User.findById(decoded.user_id);
    if (!user) return res.status(401).json({ error: "Unauthorized" });

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};
