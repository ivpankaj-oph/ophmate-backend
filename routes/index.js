import { Router } from "express";
import vendorRoutes from "./vendor.routes.js";
import productRoutes from "./product.routes.js";
import userRoutes from "./user.routes.js";

const router = Router();


// router.use("/user",userRouter);
router.use("/vendors", vendorRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);

export default router;
