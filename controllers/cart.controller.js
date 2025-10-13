import { Cart, Product } from "../models/index.js";

/**
 * ➕ Add product to cart
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity || quantity <= 0)
      return res.status(400).json({ message: "Invalid product or quantity" });

    const product = await Product.findByPk(product_id);
    if (!product || !product.is_active)
      return res.status(404).json({ message: "Product not found or inactive" });

    let cartItem = await Cart.findOne({ where: { user_id: userId, product_id } });

    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.subtotal = cartItem.quantity * product.price;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        user_id: userId,
        product_id,
        quantity,
        subtotal: quantity * product.price,
      });
    }

    res.status(200).json({ message: "Product added to cart", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 🧾 Get cart details
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.findAll({
      where: { user_id: userId, status: "active" },
      include: [{ model: Product }],
    });

    const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
    const tax = subtotal * 0.1; // 10% tax
    const shipping = subtotal > 1000 ? 0 : 50; // free shipping over 1000
    const total = subtotal + tax + shipping;

    res.status(200).json({
      message: "Cart fetched successfully",
      items: cartItems,
      summary: { subtotal, tax, shipping, total },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * ✏️ Update quantity
 */
export const updateCartQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_id, quantity } = req.body;

    const cartItem = await Cart.findOne({ where: { id: cart_id, user_id: userId } });
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    const product = await Product.findByPk(cartItem.product_id);
    cartItem.quantity = quantity;
    cartItem.subtotal = quantity * product.price;
    await cartItem.save();

    res.status(200).json({ message: "Quantity updated", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * ❌ Remove product
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_id } = req.params;

    const deleted = await Cart.destroy({ where: { id: cart_id, user_id: userId } });
    if (!deleted) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Product removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * 💾 Save for later
 */
export const saveForLater = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_id } = req.params;

    const cartItem = await Cart.findOne({ where: { id: cart_id, user_id: userId } });
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });

    cartItem.status = "saved_for_later";
    await cartItem.save();

    res.status(200).json({ message: "Moved to saved for later", cartItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
