import { Order } from "../../models/index.js";

export const placeOrder = async (req, res) => {
  try {
    const user_id = req.user.id;
    const {
      productId,
      vendorId,
      quantity,
      price,
      discount,
      shipping_address,
      payment_method,
    } = req.body;

    const total_amount = quantity * price - (discount || 0);

    const order = await Order.create({
      user_id,
      vendor_id: vendorId,
      product_id: productId,
      quantity,
      price,
      discount,
      total_amount,
      shipping_address,
      payment_method,
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const user_id = req.user.id;
    const orders = await Order.findAll({ where: { user_id } });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const user_id = req.user.id;

    const order = await Order.findOne({ where: { id: orderId, user_id } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const requestReturn = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { return_reason } = req.body;
    const user_id = req.user.id;

    const order = await Order.findOne({ where: { id: orderId, user_id } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.return_reason = return_reason;
    order.status = "Returned";
    order.return_status = "Pending";
    await order.save();

    res.json({ success: true, message: "Return requested", order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
