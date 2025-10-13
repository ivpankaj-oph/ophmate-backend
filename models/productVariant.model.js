import { DataTypes } from "sequelize";

export const ProductVariantModel = (sequelize) => {
  const ProductVariant = sequelize.define("ProductVariant", {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    product_id: { type: DataTypes.UUID, allowNull: false },
    sku: { type: DataTypes.STRING, unique: true },
    attributes: { type: DataTypes.JSONB, defaultValue: {} }, // { size: "M", color: "red" }
    price: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    mrp: { type: DataTypes.FLOAT },
    discount_percent: { type: DataTypes.FLOAT, defaultValue: 0 },
    final_price: { type: DataTypes.FLOAT, defaultValue: 0 },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    hooks: {
      beforeValidate: (variant) => {
        if (variant.price) {
          const discount = variant.discount_percent || 0;
          variant.final_price = Number((variant.price * (1 - discount / 100)).toFixed(2));
        }
      }
    }
  });

  ProductVariant.associate = (models) => {
    ProductVariant.belongsTo(models.Product, { foreignKey: "product_id" });
  };

  return ProductVariant;
};
