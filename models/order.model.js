import { DataTypes } from "sequelize";

export const OrderModel = (sequelize) => {
  const Order = sequelize.define("Order", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    order_number: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    // Foreign keys
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    vendorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    // Order Details
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    total_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    // Status flow: Pending → Processing → Shipped → Delivered → Cancelled / Returned
    status: {
      type: DataTypes.ENUM(
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned"
      ),
      defaultValue: "Pending",
    },

    payment_status: {
      type: DataTypes.ENUM("Pending", "Paid", "Failed", "Refunded"),
      defaultValue: "Pending",
    },

    payment_method: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "COD",
    },

    shipping_address: {
      type: DataTypes.JSON, // store full address object
      allowNull: false,
    },

    tracking_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    order_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    // Return & Refund Handling
    is_return_requested: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    return_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    return_status: {
      type: DataTypes.ENUM("Pending", "Approved", "Rejected", "Completed"),
      defaultValue: "Pending",
    },

    // Metadata
    timeline: {
      type: DataTypes.JSON, // [{status:"Shipped", date:"..."}, ...]
      defaultValue: [],
    },

    invoice_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Order;
};
