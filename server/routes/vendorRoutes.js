import express from 'express';
import { 
  getVendorProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getSalesAnalytics,
  getDashboardStats
} from '../controllers/vendorController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import Product from '../models/product.js';
import Order from '../models/order.js';

const router = express.Router();

// All routes require authentication and vendor role
router.use(protect);
router.use(authorize('vendor'));

// Product management routes
router.get('/products', getVendorProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Dashboard statistics
router.get('/dashboard-stats', getDashboardStats);

// Sales analytics
router.get('/analytics', getSalesAnalytics);

// Test endpoint to create sample orders (for development only)
router.post('/test/create-sample-orders', async (req, res) => {
  try {
    // Get vendor's products
    const products = await Product.find({ vendor: req.user.id }).limit(3);
    
    if (products.length === 0) {
      return res.status(400).json({ message: 'No products found. Please create some products first.' });
    }
    
    // Create sample orders for the last 30 days
    const sampleOrders = [];
    const now = new Date();
    
    for (let i = 0; i < 10; i++) {
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const randomDaysAgo = Math.floor(Math.random() * 30);
      const orderDate = new Date(now.getTime() - (randomDaysAgo * 24 * 60 * 60 * 1000));
      const randomQuantity = Math.floor(Math.random() * 5) + 1;
      
      const order = new Order({
        user: req.user.id, // Using vendor as user for testing
        vendor: req.user.id,
        product: randomProduct._id,
        quantity: randomQuantity,
        price: randomProduct.price,
        date: orderDate
      });
      
      sampleOrders.push(order);
    }
    
    await Order.insertMany(sampleOrders);
    
    res.json({ 
      message: 'Sample orders created successfully',
      ordersCreated: sampleOrders.length
    });
  } catch (error) {
    console.error('Error creating sample orders:', error);
    res.status(500).json({ 
      message: 'Error creating sample orders', 
      error: error.message 
    });
  }
});

export default router; 