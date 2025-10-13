import { DataTypes } from "sequelize";

export const WishlistModel = (sequelize) => {
  const Wishlist = sequelize.define("Wishlist", {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.UUID, allowNull: false },
    product_id: { type: DataTypes.UUID, allowNull: false },
  });

  return Wishlist;
};
