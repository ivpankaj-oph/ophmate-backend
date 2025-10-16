import { DataTypes } from "sequelize";

export const ProductModel = (sequelize) => {
  const Product = sequelize.define("Product", {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    vendor_id: { type: DataTypes.UUID, allowNull: false }, // FK to Vendor
    name: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    short_description: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    base_price: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    mrp: { type: DataTypes.FLOAT }, // optional
    discount_percent: { type: DataTypes.FLOAT, defaultValue: 0 }, // 0-100
    final_price: { type: DataTypes.FLOAT, defaultValue: 0 }, // computed
    category_id: { type: DataTypes.UUID }, // FK to Category
    subcategory: { type: DataTypes.STRING },
    image_urls: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] }, // array of paths
    video_urls: { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    stock: { type: DataTypes.INTEGER, defaultValue: 0 }, // total stock (if no variants)
    status: { type: DataTypes.ENUM("draft", "published", "inactive"), defaultValue: "draft" },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    meta: { type: DataTypes.JSONB, defaultValue: {} }, // flexible metadata
  }, {
    hooks: {
      beforeValidate: (product) => {

        if (product.base_price) {
          const discount = product.discount_percent || 0;
          product.final_price = Number((product.base_price * (1 - discount / 100)).toFixed(2));
        }
      }
    }
  });



  return Product;
};
