import { VendorModel } from "./vendor.model.js";
import { UserModel } from "./user.model.js";
import { ProductModel } from "./product.model.js";
import { CategoryModel } from "./category/CategoryModel.js";
import { SubCategoryModel } from "./category/subcategory.model.js";
import { ProductVariantModel } from "./productVariant.model.js";
import { AddressModel } from "./address.model.js";
import { CartModel } from "./Cart.model.js";
import { WishlistModel } from "./Wishlist.model.js";
import { OrderModel } from "./order.model.js";

let Vendor,
  User,
  Product,
  Category,
  SubCategory,
  ProductVariant,
  Address,
  Cart,
  Wishlist,
  Order;

export const initModels = (sequelize) => {
  // Initialize models
  Vendor = VendorModel(sequelize);
  User = UserModel(sequelize);
  Product = ProductModel(sequelize);
  Category = CategoryModel(sequelize);
  SubCategory = SubCategoryModel(sequelize);
  ProductVariant = ProductVariantModel(sequelize);
  Address = AddressModel(sequelize);
  Cart = CartModel(sequelize);
  Wishlist = WishlistModel(sequelize);
  Order = OrderModel(sequelize);

  // ------------------- ASSOCIATIONS -------------------

  // ✅ Vendor ↔ Product
  Vendor.hasMany(Product, { foreignKey: "vendor_id", as: "products" });
  Product.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });

  // ✅ User ↔ Address
  User.hasMany(Address, { foreignKey: "user_id", onDelete: "CASCADE", as: "addresses" });
  Address.belongsTo(User, { foreignKey: "user_id", as: "user" });

  // ✅ Category ↔ SubCategory
  Category.hasMany(SubCategory, { foreignKey: "category_id", as: "subcategories" });
  SubCategory.belongsTo(Category, { foreignKey: "category_id", as: "category" });

  // ✅ Category ↔ Product
  Category.hasMany(Product, { foreignKey: "category_id", as: "products" });
  Product.belongsTo(Category, { foreignKey: "category_id", as: "category" });

  // ✅ SubCategory ↔ Product (if needed)
  SubCategory.hasMany(Product, { foreignKey: "subcategory_id", as: "products" });
  Product.belongsTo(SubCategory, { foreignKey: "subcategory_id", as: "subcategory" });

  // ✅ Product ↔ ProductVariant
  Product.hasMany(ProductVariant, { foreignKey: "product_id", as: "variants", onDelete: "CASCADE" });
  ProductVariant.belongsTo(Product, { foreignKey: "product_id", as: "product" });

  // ✅ User ↔ Cart
  User.hasMany(Cart, { foreignKey: "user_id", as: "cartItems" });
  Cart.belongsTo(User, { foreignKey: "user_id", as: "user" });

  // ✅ Product ↔ Cart
  Product.hasMany(Cart, { foreignKey: "product_id", as: "cartProducts" });
  Cart.belongsTo(Product, { foreignKey: "product_id", as: "product" });

  // ✅ User ↔ Wishlist
  User.hasMany(Wishlist, { foreignKey: "user_id", as: "wishlistItems" });
  Wishlist.belongsTo(User, { foreignKey: "user_id", as: "user" });

  // ✅ Product ↔ Wishlist
  Product.hasMany(Wishlist, { foreignKey: "product_id", as: "wishlistProducts" });
  Wishlist.belongsTo(Product, { foreignKey: "product_id", as: "product" });

  // ✅ Vendor ↔ Order
  Vendor.hasMany(Order, { foreignKey: "vendor_id", as: "orders" });
  Order.belongsTo(Vendor, { foreignKey: "vendor_id", as: "vendor" });

  // ✅ User ↔ Order
  User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
  Order.belongsTo(User, { foreignKey: "user_id", as: "user" });

  // ✅ Product ↔ Order (optional if orders track product)
  Product.hasMany(Order, { foreignKey: "product_id", as: "orders" });
  Order.belongsTo(Product, { foreignKey: "product_id", as: "product" });

  // ------------------- RETURN MODELS -------------------
  return {
    Vendor,
    User,
    Product,
    Category,
    SubCategory,
    ProductVariant,
    Address,
    Cart,
    Wishlist,
    Order,
  };
};

// Export models individually
export {
  Vendor,
  User,
  Product,
  Category,
  SubCategory,
  ProductVariant,
  Address,
  Cart,
  Wishlist,
  Order,
};
