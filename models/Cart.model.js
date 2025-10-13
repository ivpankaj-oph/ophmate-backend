import { DataTypes } from "sequelize";

export const CartModel = (sequelize) => {
  const Cart = sequelize.define("Cart", {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.UUID, allowNull: false },
    product_id: { type: DataTypes.UUID, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
    subtotal: { type: DataTypes.FLOAT, defaultValue: 0.0 },
    status: { 
      type: DataTypes.ENUM("active", "saved_for_later", "checked_out"),
      defaultValue: "active"
    },
  });

  return Cart;
};
