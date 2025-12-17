import { Cart } from "../Models/cartModels.js";
import { decryptData } from "../utils/commonFunction.js";

const cartControllers = {
  addToCart: async (req, res) => {
    try {
      const { userId, shoeId, quantity } = req.body;
      if (!userId || !shoeId) {
        return res.status(400).json({
          success: false,
          error: "userId and shoeId are required",
        });
      }
      let cart = await Cart.findOne({ userId });
      if (!cart) {
        cart = new Cart({
          userId,
          products: [
            {
              shoeId,
              quantity: quantity || 1,
            },
          ],
        });
      } else {
        const productIndex = cart.products.findIndex(
          (p) => p.shoeId.toString() === shoeId
        );
        if (productIndex > -1) {
          cart.products[productIndex].quantity += quantity || 1;
          cart.products[productIndex].createdAt = new Date();
        } else {
          cart.products.push({
            shoeId,
            quantity: quantity || 1,
            createdAt: new Date(),
          });
        }
      }
      await cart.save();

      res.status(200).json({
        success: true,
        message: "Item added to cart",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
  getCartItems: async (req, res) => {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({
          success: false,
          error: "userId is required",
        });
      }

      const userCart = await Cart.findOne({ userId })
        .populate("products.shoeId")
        .lean();

      if (!userCart) {
        return res.status(200).json({
          success: true,
          cart: { products: [] },
        });
      }

      userCart.products.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      const formattedCart = {
        cartId: userCart._id,
        userId: userCart.userId,
        products: userCart.products.map((p) => ({
          id: p._id,
          shoeId: p.shoeId._id,
          name: p.shoeId.name,
          brand: p.shoeId.brand,
          gender: p.shoeId.gender,
          category: p.shoeId.category,
          price: p.shoeId.price,
          quantity: p.quantity,
          imageURL: p.shoeId.imageURL,
          slug: p.shoeId.slug,
          is_in_inventory: p.shoeId.is_in_inventory,
          items_left: p.shoeId.items_left,
          featured: p.shoeId.featured,
        })),
      };

      res.status(200).json({ success: true, cart: formattedCart });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
  removeCartItem: async (req, res) => {
    try {
      const encryptedUserId = req.query.userId;
      const encryptedShoeId = req.query.shoeId;

      if (!encryptedUserId || !encryptedShoeId) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Encrypted userId and shoeId are required",
          });
      }
      const userId = decryptData(encryptedUserId);
      const shoeId = decryptData(encryptedShoeId);
      const userCart = await Cart.findOne({ userId });

      if (!userCart) {
        return res
          .status(404)
          .json({ success: false, error: "Cart not found" });
      }
      const itemIndex = userCart.products.findIndex(
        (p) => p?.shoeId?.toString() === shoeId
      );
      if (itemIndex === -1) {
        return res
          .status(404)
          .json({ success: false, error: "Item not found in cart" });
      }
      const itemToRemove = userCart.products[itemIndex];
      if (itemToRemove.quantity > 1) {
        userCart.products[itemIndex].quantity -= 1;
      } else {
        userCart.products = userCart.products.filter(
          (p) => p?.shoeId?.toString() !== shoeId
        );
      }
      await userCart.save();
      return res
        .status(200)
        .json({ success: true, message: "Item removed from cart" });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },
};

export default cartControllers;
