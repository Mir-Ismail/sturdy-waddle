import Product from '../models/product.js';
import Order from '../models/order.js';

// Get all products for a vendor
export const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      images, 
      price, 
      quantity, 
      category, 
      brand, 
      specifications 
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, price, quantity, category' 
      });
    }

    // Validate price and quantity
    if (price <= 0 || quantity < 0) {
      return res.status(400).json({ 
        message: 'Price must be greater than 0 and quantity must be non-negative' 
      });
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      images: images || [],
      price: parseFloat(price),
      quantity: parseInt(quantity),
      category: category.trim(),
      brand: brand ? brand.trim() : '',
      specifications: specifications || [],
      vendor: req.user.id
    });
    
    await product.save();
    
    res.status(201).json({
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Product creation error:', error);
    res.status(500).json({ 
      message: 'Error creating product', 
      error: error.message 
    });
  }
};

// Update a product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      images, 
      price, 
      quantity, 
      category, 
      brand, 
      specifications 
    } = req.body;
    
    // Validate required fields
    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields: name, description, price, quantity, category' 
      });
    }

    // Validate price and quantity
    if (price <= 0 || quantity < 0) {
      return res.status(400).json({ 
        message: 'Price must be greater than 0 and quantity must be non-negative' 
      });
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, vendor: req.user.id },
      { 
        name: name.trim(),
        description: description.trim(),
        images: images || [],
        price: parseFloat(price),
        quantity: parseInt(quantity),
        category: category.trim(),
        brand: brand ? brand.trim() : '',
        specifications: specifications || [],
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Product update error:', error);
    res.status(500).json({ 
      message: 'Error updating product', 
      error: error.message 
    });
  }
};

// Delete a product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findOneAndDelete({ _id: id, vendor: req.user.id });
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Product deletion error:', error);
    res.status(500).json({ 
      message: 'Error deleting product', 
      error: error.message 
    });
  }
};

// Get sales analytics
export const getSalesAnalytics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'hour':
        dateFilter = { date: { $gte: new Date(now.getTime() - 60 * 60 * 1000) } };
        break;
      case 'day':
        dateFilter = { date: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
        break;
      case 'month':
        dateFilter = { date: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
        break;
      case 'year':
        dateFilter = { date: { $gte: new Date(now.getFullYear(), 0, 1) } };
        break;
      default:
        dateFilter = { date: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
    }
    
    // Get orders for this vendor
    const orders = await Order.find({ 
      vendor: req.user.id,
      ...dateFilter
    }).populate('product');
    
    // Calculate analytics
    const totalSales = orders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
    const totalOrders = orders.length;
    const totalItems = orders.reduce((sum, order) => sum + order.quantity, 0);
    
    // Group by product
    const productSales = {};
    orders.forEach(order => {
      if (order.product) { // Check if product exists
        const productName = order.product.name;
        if (!productSales[productName]) {
          productSales[productName] = { quantity: 0, revenue: 0 };
        }
        productSales[productName].quantity += order.quantity;
        productSales[productName].revenue += order.price * order.quantity;
      }
    });

    // Build sales trend grouped by day (YYYY-MM-DD)
    const salesTrendMap = new Map();
    orders.forEach(order => {
      const d = new Date(order.date);
      const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const amount = order.price * order.quantity;
      salesTrendMap.set(dayKey, (salesTrendMap.get(dayKey) || 0) + amount);
    });
    const salesTrend = Array.from(salesTrendMap.entries())
      .map(([date, sales]) => ({ date, sales }))
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    
    // Add some debugging information
    console.log(`Analytics for vendor ${req.user.id}, period: ${period}`);
    console.log(`Found ${orders.length} orders`);
    console.log(`Total sales: ${totalSales}, Total orders: ${totalOrders}, Total items: ${totalItems}`);
    
    res.json({
      period,
      totalSales,
      totalOrders,
      totalItems,
      productSales: Object.entries(productSales).map(([name, data]) => ({
        name,
        ...data
      })),
      salesTrend,
      debug: {
        vendorId: req.user.id,
        ordersFound: orders.length,
        dateFilter: dateFilter
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      message: 'Error fetching analytics', 
      error: error.message 
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user.id;
    
    // Get current month start date
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Get total products
    const totalProducts = await Product.countDocuments({ vendor: vendorId });
    
    // Get products created this month
    const productsThisMonth = await Product.countDocuments({
      vendor: vendorId,
      createdAt: { $gte: monthStart }
    });
    
    // Get total orders
    const totalOrders = await Order.countDocuments({ vendor: vendorId });
    
    // Get orders this month
    const ordersThisMonth = await Order.countDocuments({
      vendor: vendorId,
      date: { $gte: monthStart }
    });
    
    // Get total sales
    const allOrders = await Order.find({ vendor: vendorId });
    const totalSales = allOrders.reduce((sum, order) => sum + (order.price * order.quantity), 0);
    
    // Get sales this month
    const ordersThisMonthData = await Order.find({
      vendor: vendorId,
      date: { $gte: monthStart }
    });
    const salesThisMonth = ordersThisMonthData.reduce((sum, order) => sum + (order.price * order.quantity), 0);
    
    console.log(`Dashboard stats for vendor ${vendorId}:`, {
      totalProducts,
      productsThisMonth,
      totalOrders,
      ordersThisMonth,
      totalSales,
      salesThisMonth
    });
    
    res.json({
      totalProducts,
      productsThisMonth,
      totalOrders,
      ordersThisMonth,
      totalSales,
      salesThisMonth
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard statistics', 
      error: error.message 
    });
  }
}; 