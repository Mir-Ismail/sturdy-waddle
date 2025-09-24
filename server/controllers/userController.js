import Order from '../models/order.js';
import Favorite from '../models/favorite.js';
import Cart from '../models/cart.js';
import Wishlist from '../models/wishlist.js';
import Product from '../models/product.js';

// Get user's order history
export const getOrderHistory = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('product')
      .populate('vendor', 'username email')
      .sort({ date: -1 });
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history', error: error.message });
  }
};

// Get user's favorites
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user.id })
      .populate('product')
      .sort({ createdAt: -1 });
    
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorites', error: error.message });
  }
};

// Add product to favorites
export const addToFavorites = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if already in favorites
    const existing = await Favorite.findOne({ user: req.user.id, product: productId });
    if (existing) {
      return res.status(400).json({ message: 'Product already in favorites' });
    }
    
    const favorite = new Favorite({
      user: req.user.id,
      product: productId
    });
    
    await favorite.save();
    await favorite.populate('product');
    
    res.status(201).json(favorite);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to favorites', error: error.message });
  }
};

// Remove from favorites
export const removeFromFavorites = async (req, res) => {
  try {
    const { productId } = req.params;
    
    await Favorite.findOneAndDelete({ user: req.user.id, product: productId });
    
    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from favorites', error: error.message });
  }
};

// ===== CART FUNCTIONS =====

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.user.id })
      .populate('productId')
      .sort({ addedAt: -1 });
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error: error.message });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    
    // Check if product exists and get its price
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if already in cart
    const existing = await Cart.findOne({ userId: req.user.id, productId });
    if (existing) {
      // Update quantity
      existing.quantity += quantity;
      await existing.save();
      await existing.populate('productId');
      return res.json(existing);
    }
    
    // Add new item to cart
    const cartItem = new Cart({
      userId: req.user.id,
      productId,
      quantity,
      priceAtTimeOfAdding: product.price
    });
    
    await cartItem.save();
    await cartItem.populate('productId');
    
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error: error.message });
  }
};

// Update cart item quantity
export const updateCartQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (quantity < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }
    
    const cartItem = await Cart.findOneAndUpdate(
      { userId: req.user.id, productId },
      { quantity },
      { new: true }
    ).populate('productId');
    
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error: error.message });
  }
};

// Remove from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    
    await Cart.findOneAndDelete({ userId: req.user.id, productId });
    
    res.json({ message: 'Removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user.id });
    
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
};

// Checkout cart - creates order and clears cart
export const checkoutCart = async (req, res) => {
  try {
    // Get user's cart items
    const cartItems = await Cart.find({ userId: req.user.id }).populate('productId');
    
    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Create orders for each cart item
    const orders = [];
    for (const cartItem of cartItems) {
      const order = new Order({
        user: req.user.id,
        product: cartItem.productId._id,
        vendor: cartItem.productId.vendor,
        quantity: cartItem.quantity,
        price: cartItem.priceAtTimeOfAdding,
        totalAmount: cartItem.quantity * cartItem.priceAtTimeOfAdding,
        status: 'pending',
        date: new Date()
      });
      
      await order.save();
      orders.push(order);
    }

    // Clear the cart after successful order creation
    await Cart.deleteMany({ userId: req.user.id });

    res.status(201).json({ 
      message: 'Order placed successfully', 
      orders: orders,
      totalItems: orders.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error during checkout', error: error.message });
  }
};

// ===== WISHLIST FUNCTIONS =====

// Get user's wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user.id })
      .populate('productId')
      .sort({ addedAt: -1 });
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error: error.message });
  }
};

// Add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Check if already in wishlist
    const existing = await Wishlist.findOne({ userId: req.user.id, productId });
    if (existing) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }
    
    const wishlistItem = new Wishlist({
      userId: req.user.id,
      productId
    });
    
    await wishlistItem.save();
    await wishlistItem.populate('productId');
    
    res.status(201).json(wishlistItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error: error.message });
  }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    
    await Wishlist.findOneAndDelete({ userId: req.user.id, productId });
    
    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error: error.message });
  }
};

// Check if product is in wishlist
export const checkWishlistStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const wishlistItem = await Wishlist.findOne({ userId: req.user.id, productId });
    
    res.json({ isWishlisted: !!wishlistItem });
  } catch (error) {
    res.status(500).json({ message: 'Error checking wishlist status', error: error.message });
  }
}; 