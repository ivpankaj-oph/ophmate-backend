// models/ProductVariantModel.js
import { DataTypes } from "sequelize";

export const ProductVariantModel = (sequelize) => {
  const ProductVariant = sequelize.define("ProductVariant", {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    product_id: { type: DataTypes.UUID, allowNull: false },
    sku: { type: DataTypes.STRING, allowNull: false, unique: true },
    attributes: { type: DataTypes.JSONB, defaultValue: {} },
    actual_price: { type: DataTypes.FLOAT, allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: false },
    discount_percent: { type: DataTypes.FLOAT, defaultValue: 0 },
    final_price: { type: DataTypes.FLOAT, defaultValue: 0 },
    stockQuantity: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
  });

  ProductVariant.associate = (models) => {
    ProductVariant.belongsTo(models.Product, { foreignKey: "product_id", as: "product" });
  };

  return ProductVariant;
};
