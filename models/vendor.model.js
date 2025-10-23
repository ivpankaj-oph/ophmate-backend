import { DataTypes } from "sequelize";

export const VendorModel = (sequelize) => {
  const Vendor = sequelize.define("Vendor", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    // Basic Info
    name: { type: DataTypes.STRING, allowNull: true },
    business_type: { type: DataTypes.STRING, allowNull: true },
    gst_number: { type: DataTypes.STRING, unique: true },
    pan_number: { type: DataTypes.STRING, unique: true },

    // Alternate Contact
    alternate_contact_name: { type: DataTypes.STRING },
    alternate_contact_phone: { type: DataTypes.STRING },

    // Address
    address: { type: DataTypes.STRING },
    street: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    pincode: { type: DataTypes.STRING },

    // Bank Details
    bank_name: { type: DataTypes.STRING },
    bank_account: { type: DataTypes.STRING },
    ifsc_code: { type: DataTypes.STRING },
    branch: { type: DataTypes.STRING },
    upi_id: { type: DataTypes.STRING },

    // Other Info
    categories: { type: DataTypes.STRING }, // comma separated
    return_policy: { type: DataTypes.STRING },
    operating_hours: { type: DataTypes.STRING },

    // Documents
    gst_cert: { type: DataTypes.STRING }, // store file path or URL
    pan_card: { type: DataTypes.STRING }, // store file path or URL

    // Authentication
    email: { type: DataTypes.STRING, allowNull: true, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING },

    // Role & Status
    role: { type: DataTypes.STRING, defaultValue: "vendor" },
    is_email_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_profile_completed: { type: DataTypes.BOOLEAN, defaultValue: false },
    profile_complete_level: { type: DataTypes.INTEGER, defaultValue: 0 },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  return Vendor;
};
