import { DataTypes } from "sequelize";


export const CategoryModel = (sequelize) => {
  const Category = sequelize.define(
    "Category",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,

      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      meta_title: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      meta_description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      meta_keywords: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      display_order: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    { paranoid: true } // soft delete
  );




  return Category;
};
