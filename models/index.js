import { VendorModel } from "./vendor.model.js";
import { UserModel } from "./user.model.js";
import { ProductModel } from "./product.model.js";

let Vendor, User, Product;

export const initModels = (sequelize) => {
  Vendor = VendorModel(sequelize);
  User = UserModel(sequelize);
  Product = ProductModel(sequelize);

  // Define associations
  Vendor.belongsTo(User, { foreignKey: "user_id" });
  User.hasMany(Vendor, { foreignKey: "user_id" });

  Product.belongsTo(Vendor, { foreignKey: "vendor_id" });
  Vendor.hasMany(Product, { foreignKey: "vendor_id" });

  return { Vendor, User, Product };
};

// ✅ Export them after initialization
export { Vendor, User, Product };
