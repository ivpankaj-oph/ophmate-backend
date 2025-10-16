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
  ProductVariant,
  Address,
  Cart,
  Wishlist,
  Order,
  SubCategory;
export const initModels = (sequelize) => {
  Vendor = VendorModel(sequelize);
  User = UserModel(sequelize);
  Product = ProductModel(sequelize);
  Category = CategoryModel(sequelize);
  ProductVariant = ProductVariantModel(sequelize);
  Address = AddressModel(sequelize);
  Cart = CartModel(sequelize);
  Wishlist = WishlistModel(sequelize);
  Order = OrderModel(sequelize);
  SubCategory = SubCategoryModel(sequelize);
  // associations
  Vendor.hasMany(Product, { foreignKey: "vendor_id" });
  Product.belongsTo(Vendor, { foreignKey: "vendor_id" });

  User.hasMany(Address, { foreignKey: "user_id", onDelete: "CASCADE" });
  Address.belongsTo(User, { foreignKey: "user_id" });

  Product.hasMany(ProductVariant, {
    foreignKey: "product_id",
    onDelete: "CASCADE",
  });
  ProductVariant.belongsTo(Product, { foreignKey: "product_id" });

  Category.hasMany(Product, { foreignKey: "category_id" });
  Product.belongsTo(Category, { foreignKey: "category_id" });

  User.hasMany(Cart, { foreignKey: "user_id" });
  Cart.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Wishlist, { foreignKey: "user_id" });
  Wishlist.belongsTo(User, { foreignKey: "user_id" });

  Product.hasMany(Cart, { foreignKey: "product_id" });
  Cart.belongsTo(Product, { foreignKey: "product_id" });

  Product.hasMany(Wishlist, { foreignKey: "product_id" });
  Wishlist.belongsTo(Product, { foreignKey: "product_id" });

  Vendor.hasMany(Order, { foreignKey: "vendor_id" });
  Order.belongsTo(Vendor, { foreignKey: "vendor_id" });

  User.hasMany(Order, { foreignKey: "user_id" });
  Order.belongsTo(User, { foreignKey: "user_id" });

SubCategory.belongsTo(Category, { foreignKey: "category_id", as: "category" });
Category.hasMany(SubCategory, { foreignKey: "category_id", as: "subcategories" });


  return {
    Vendor,
    User,
    Product,
    Category,
    ProductVariant,
    Address,
    Cart,
    Wishlist,
    Order,
    SubCategory,
  };
};

export {
  Vendor,
  User,
  Product,
  Category,
  ProductVariant,
  Address,
  Cart,
  Wishlist,
  Order,
  SubCategory,
};
