// models/ProductModel.js
import { DataTypes } from "sequelize";


export const ProductModel = (sequelize) => {
  const Product = sequelize.define("Product", {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    vendor_id: { type: DataTypes.UUID, allowNull: false }, // link to vendor
    productName: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    productCategory: { type: DataTypes.STRING, allowNull: false },
    productSubCategory: { type: DataTypes.STRING },
    brand: { type: DataTypes.STRING },
    short_description: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    isAvailable: { type: DataTypes.BOOLEAN, defaultValue: true },
    image_urls: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    video_urls: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
  });

  Product.associate = (models) => {
    Product.hasMany(models.ProductVariant, { foreignKey: "product_id", as: "variants" });
  };
// Product.js

  return Product;
};
