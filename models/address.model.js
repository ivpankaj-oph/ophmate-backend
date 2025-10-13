// models/address.model.js
import { DataTypes } from "sequelize";

export const AddressModel = (sequelize) => {
  const Address = sequelize.define("Address", {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    user_id: { type: DataTypes.UUID, allowNull: false },
    label: { type: DataTypes.STRING, allowNull: false }, // home, work, etc.
    address_line: { type: DataTypes.TEXT, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    pincode: { type: DataTypes.STRING, allowNull: false },
    country: { type: DataTypes.STRING, defaultValue: "India" },
    is_default: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  return Address;
};
