import { VendorModel } from "./vendor.model.js";
import { UserModel } from "./user.model.js";
import { ProductModel } from "./product.model.js";
import { CategoryModel } from "./CategoryModel.js";
import { ProductVariantModel } from "./productVariant.model.js";
import { AddressModel } from "./address.model.js";
import { CartModel } from "./Cart.model.js";
import { WishlistModel } from "./Wishlist.model.js";
import { OrderModel } from "./order.model.js";


let Vendor, User, Product, Category, ProductVariant, Address , Cart, Wishlist ,Order;

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

  Product.belongsTo(Category, { foreignKey: "category_id" });

  User.hasMany(Cart, { foreignKey: "user_id" });
  Cart.belongsTo(User, { foreignKey: "user_id" });

  User.hasMany(Wishlist, { foreignKey: "user_id" });
  Wishlist.belongsTo(User, { foreignKey: "user_id" });

  Product.hasMany(Cart, { foreignKey: "product_id" });
  Cart.belongsTo(Product, { foreignKey: "product_id" });

  Product.hasMany(Wishlist, { foreignKey: "product_id" });
  Wishlist.belongsTo(Product, { foreignKey: "product_id" });

  Vendor.hasMany(Product, { foreignKey: "vendorId" });
  Product.belongsTo(Vendor, { foreignKey: "vendorId" });

  Vendor.hasMany(Order, { foreignKey: "vendorId" });
  Order.belongsTo(Vendor, { foreignKey: "vendorId" });

  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User, { foreignKey: "userId" });

  Product.hasMany(Order, { foreignKey: "productId" });
  Order.belongsTo(Product, { foreignKey: "productId" });

  return { Vendor, User, Product, Category, ProductVariant, Address ,Cart, Wishlist,Order };
};

export { Vendor, User, Product, Category, ProductVariant, Address,Cart, Wishlist,Order };
