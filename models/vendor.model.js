import { DataTypes } from "sequelize";

export const VendorModel =(sequelize) => {
  const Vendor = sequelize.define("Vendor", {
    id: { type: DataTypes.UUID, primaryKey: true, defaultValue: DataTypes.UUIDV4 },
    business_name: { type: DataTypes.STRING, allowNull: true },
    gst_number: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    address: { type: DataTypes.TEXT },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    pincode: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "vendor" },
    bank_account: { type: DataTypes.STRING },
    ifsc_code: { type: DataTypes.STRING },
    is_profile_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    profile_complete_level: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  return Vendor;
};
