import { Order, Product } from "../models/index.js";
import { Op } from "sequelize";


/** -------------------------------------
 *  Get All Orders Related to Vendor
 * -------------------------------------*/
export const getVendorOrders = async (req, res) => {
  try {
    const { id: vendorId } = req.vendor;

    const orders = await Order.findAll({
      where: { vendorId },
      include: [{ model: Product, attributes: ["name", "price", "image_url"] }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ orders });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/** -------------------------------------
 *  Update Order Status
 * -------------------------------------*/
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const { id: vendorId } = req.vendor;

    const order = await Order.findOne({ where: { id: orderId, vendorId } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.update({ status });
    res.status(200).json({ message: `Order updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// /** -------------------------------------
//  *  Download Invoice
//  * -------------------------------------*/
// export const downloadInvoice = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { id: vendorId } = req.vendor;

//     const order = await Order.findOne({ where: { id: orderId, vendorId } });
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     const pdfPath = await createInvoicePDF(order);
//     res.download(pdfPath);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
