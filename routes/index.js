import { Router } from "express";
import vendorRoutes from "./vendor/vendor.routes.js";
import productRoutes from "./vendor/product.routes.js";
import userRoutes from "./user/user.routes.js";
import adminRoutes from "./admin/admin.routes.js";
import categoryRoutes from "./admin/adminCategory.routes.js";
import cartRoutes from "./user/cart.routes.js";
import wishlistRoutes from "./user/wishlist.routes.js";
import vendorOrderRoutes from "./vendor/vendorOrder.routes.js";
import userOrderRoutes from "./user/order.routes.js";
import subCategoryRoutes from "./admin/subcategory.routes.js";
import bannerRoutes from "./banner.routes.js";

const router = Router();



router.use("/vendor", vendorRoutes);
router.use("/products", productRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/categories",categoryRoutes );
router.use("/subcategories", subCategoryRoutes);
router.use("/banners", bannerRoutes);
router.use("/cart",cartRoutes );
router.use("/wishlist",wishlistRoutes );
router.use("/vendor-orders",vendorOrderRoutes );
router.use("/user-orders",userOrderRoutes );

export default router;
