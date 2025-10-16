import { DataTypes } from "sequelize";

export const SubCategoryModel = (sequelize) => {
  const SubCategory = sequelize.define("SubCategory", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image_url: {
      type: DataTypes.STRING,
    },
    category_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Categories",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  return SubCategory;
};
