import { Wishlist, Product, Cart } from "../models/index.js";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id } = req.body;

    const exists = await Wishlist.findOne({ where: { user_id: userId, product_id } });
    if (exists) return res.status(400).json({ message: "Already in wishlist" });

    const product = await Product.findByPk(product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const wishlistItem = await Wishlist.create({ user_id: userId, product_id });
    res.status(200).json({ message: "Added to wishlist", wishlistItem });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { wishlist_id } = req.params;

    const deleted = await Wishlist.destroy({ where: { id: wishlist_id, user_id: userId } });
    if (!deleted) return res.status(404).json({ message: "Item not found" });

    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const items = await Wishlist.findAll({
      where: { user_id: userId },
      include: [{ model: Product }],
    });
    res.status(200).json({ message: "Wishlist fetched", items });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const moveToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { wishlist_id } = req.params;

    const wishlistItem = await Wishlist.findOne({ where: { id: wishlist_id, user_id: userId } });
    if (!wishlistItem) return res.status(404).json({ message: "Wishlist item not found" });

    const product = await Product.findByPk(wishlistItem.product_id);
    await Cart.create({
      user_id: userId,
      product_id: wishlistItem.product_id,
      quantity: 1,
      subtotal: product.price,
    });

    await wishlistItem.destroy();

    res.status(200).json({ message: "Moved to cart successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
