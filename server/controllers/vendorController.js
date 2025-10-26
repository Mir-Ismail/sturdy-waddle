import Product from '../models/product.js';
import Order from '../models/order.js';
import { AppError, catchAsync } from '../middleware/errorHandler.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureUploadsDir() {
  const productsDir = path.join(__dirname, '..', 'uploads', 'products');
  if (!fs.existsSync(productsDir)) {
    fs.mkdirSync(productsDir, { recursive: true });
  }
  return productsDir;
}

function sanitizeFileNameHint(fileNameHint) {
  const lowered = (fileNameHint || 'image').toString().toLowerCase();
  // Replace any non-alphanumeric with hyphens, collapse repeats, trim hyphens
  return lowered
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '') || 'image';
}

function saveBase64ImageToDisk(base64Data, fileNameHint = 'image') {
  // base64Data expected format: data:image/png;base64,XXXX or pure base64
  const matches = /^data:(.*?);base64,(.*)$/.exec(base64Data || '');
  const mimeType = matches ? matches[1] : 'image/png';
  const dataPart = matches ? matches[2] : base64Data;
  const extension = mimeType.split('/')[1] || 'png';

  const uploadsDir = ensureUploadsDir();
  const safeHint = sanitizeFileNameHint(fileNameHint);
  const fileName = `${safeHint}-${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  const buffer = Buffer.from(dataPart, 'base64');
  fs.writeFileSync(filePath, buffer);
  // Public URL path served by Express static middleware in index.js
  const publicUrlPath = `/uploads/products/${fileName}`;
  return publicUrlPath;
}

function makeAbsoluteUrl(req, urlPath) {
  if (!urlPath) return urlPath;
  if (urlPath.startsWith('http://') || urlPath.startsWith('https://')) return urlPath;
  const origin = `${req.protocol}://${req.get('host')}`;
  return `${origin}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
}

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

    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({
        message: 'Missing required fields: name, description, price, quantity, category'
      });
    }

    if (price <= 0 || quantity < 0) {
      return res.status(400).json({
        message: 'Price must be greater than 0 and quantity must be non-negative'
      });
    }

    // Persist images to local disk and store URLs
    let imageUrls = [];
    if (Array.isArray(images) && images.length > 0) {
      imageUrls = images.map((img, idx) => {
        const urlPath = saveBase64ImageToDisk(img, name || `product-${idx}`);
        return makeAbsoluteUrl(req, urlPath);
      });
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      images: imageUrls,
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

    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({
        message: 'Missing required fields: name, description, price, quantity, category'
      });
    }

    if (price <= 0 || quantity < 0) {
      return res.status(400).json({
        message: 'Price must be greater than 0 and quantity must be non-negative'
      });
    }

    // Normalize and persist images: keep existing URLs, save new base64s
    let nextImages = [];
    if (Array.isArray(images)) {
      nextImages = images.map((img, idx) => {
        if (typeof img === 'string') {
          // If it's a relative path from previous data, convert to absolute
          if (img.startsWith('/uploads/')) {
            return makeAbsoluteUrl(req, img);
          }
          // If already absolute, keep as is
          if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
          }
        }
        const urlPath = saveBase64ImageToDisk(img, name || `product-${idx}`);
        return makeAbsoluteUrl(req, urlPath);
      });
    }

    const product = await Product.findOneAndUpdate(
      { _id: id, vendor: req.user.id },
      {
        name: name.trim(),
        description: description.trim(),
        images: nextImages,
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
    const vendorId = req.user.id;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case 'hour':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 60 * 60 * 1000) } };
        break;
      case 'day':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) } };
        break;
      case 'month':
        dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
        break;
      case 'year':
        dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), 0, 1) } };
        break;
      default:
        dateFilter = { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) } };
    }

    // Get vendor's products
    const vendorProducts = await Product.find({ vendor: vendorId }).select('_id');
    const vendorProductIds = vendorProducts.map(p => p._id);

    // If vendor has no products, return empty analytics
    if (vendorProductIds.length === 0) {
      return res.json({
        period,
        totalSales: 0,
        totalOrders: 0,
        totalItems: 0,
        productSales: [],
        salesTrend: []
      });
    }

    // Get orders containing vendor's products
    const orders = await Order.find({
      'items.product': { $in: vendorProductIds },
      ...dateFilter
    }).populate('items.product');

    // Calculate analytics for vendor's items only
    let totalSales = 0;
    let totalItems = 0;
    const productSales = {};
    const salesTrendMap = new Map();

    orders.forEach(order => {
      order.items.forEach(item => {
        // Check if item.product exists and is populated
        if (!item.product) return;

        // Get product ID (handles both populated and non-populated cases)
        const productId = item.product._id || item.product;

        // Only count if this item is vendor's product
        if (vendorProductIds.some(id => id.equals(productId))) {
          const itemTotal = item.total || (item.price * item.quantity);
          totalSales += itemTotal;
          totalItems += item.quantity;

          // Product sales - handle both populated and non-populated
          const productName = item.product.name || 'Unknown Product';
          if (!productSales[productName]) {
            productSales[productName] = { quantity: 0, revenue: 0 };
          }
          productSales[productName].quantity += item.quantity;
          productSales[productName].revenue += itemTotal;

          // Sales trend
          const d = new Date(order.createdAt);
          const dayKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          salesTrendMap.set(dayKey, (salesTrendMap.get(dayKey) || 0) + itemTotal);
        }
      });
    });

    const salesTrend = Array.from(salesTrendMap.entries())
      .map(([date, sales]) => ({ date, sales }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Log analytics data for debugging
    console.log('Analytics Response:', {
      period,
      totalSales,
      totalOrders: orders.length,
      totalItems,
      productSalesCount: Object.keys(productSales).length,
      salesTrendCount: salesTrend.length
    });

    res.json({
      period,
      totalSales,
      totalOrders: orders.length,
      totalItems,
      productSales: Object.entries(productSales).map(([name, data]) => ({
        name,
        ...data
      })),
      salesTrend
    });
  } catch (error) {
    console.error('Analytics error:', error);
    // Return empty data instead of error for better UX
    res.status(200).json({
      period,
      totalSales: 0,
      totalOrders: 0,
      totalItems: 0,
      productSales: [],
      salesTrend: []
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const vendorId = req.user.id;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get total products
    const totalProducts = await Product.countDocuments({ vendor: vendorId });

    // Get products created this month
    const productsThisMonth = await Product.countDocuments({
      vendor: vendorId,
      createdAt: { $gte: monthStart }
    });

    // Get vendor's products
    const vendorProducts = await Product.find({ vendor: vendorId }).select('_id');
    const vendorProductIds = vendorProducts.map(p => p._id);

    // Get all orders containing vendor's products
    const allOrders = await Order.find({
      'items.product': { $in: vendorProductIds }
    }).populate('items.product');

    // Get orders this month
    const ordersThisMonth = await Order.find({
      'items.product': { $in: vendorProductIds },
      createdAt: { $gte: monthStart }
    }).populate('items.product');

    // Calculate total sales (only vendor's items)
    let totalSales = 0;
    allOrders.forEach(order => {
      order.items.forEach(item => {
        if (vendorProductIds.some(id => id.equals(item.product._id))) {
          totalSales += item.total || (item.price * item.quantity);
        }
      });
    });

    // Calculate sales this month
    let salesThisMonth = 0;
    ordersThisMonth.forEach(order => {
      order.items.forEach(item => {
        if (vendorProductIds.some(id => id.equals(item.product._id))) {
          salesThisMonth += item.total || (item.price * item.quantity);
        }
      });
    });

    res.json({
      totalProducts,
      productsThisMonth,
      totalOrders: allOrders.length,
      ordersThisMonth: ordersThisMonth.length,
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

// Get all orders for the vendor
export const getVendorOrders = catchAsync(async (req, res, next) => {
  const vendorId = req.user.id;
  const { page = 1, limit = 20, status } = req.query;

  // Get all products belonging to this vendor
  const vendorProducts = await Product.find({ vendor: vendorId }).select('_id');
  const vendorProductIds = vendorProducts.map(p => p._id);

  if (vendorProductIds.length === 0) {
    return res.status(200).json({
      success: true,
      orders: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalOrders: 0,
        hasNext: false,
        hasPrev: false
      }
    });
  }

  // Build filter
  const filter = {
    'items.product': { $in: vendorProductIds }
  };

  if (status) {
    filter.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const orders = await Order.find(filter)
    .populate({
      path: 'items.product',
      select: 'name price images category brand vendor'
    })
    .populate('user', 'username email firstName lastName')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Filter and transform orders to only include vendor's items
  const filteredOrders = orders.map(order => {
    const vendorItems = order.items.filter(item =>
      item.product && vendorProductIds.some(id => id.equals(item.product._id))
    );

    const vendorSubtotal = vendorItems.reduce((sum, item) => sum + (item.total || 0), 0);

    return {
      _id: order._id,
      orderNumber: order.orderNumber,
      user: order.user,
      items: vendorItems,
      shippingAddress: order.shippingAddress,
      status: order.status,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      total: order.total,
      vendorSubtotal,
      notes: order.notes,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    };
  });

  const totalOrders = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    orders: filteredOrders,
    pagination: {
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalOrders / parseInt(limit)),
      totalOrders,
      hasNext: parseInt(page) < Math.ceil(totalOrders / parseInt(limit)),
      hasPrev: parseInt(page) > 1
    }
  });
});

// Get a single order by ID
export const getVendorOrderById = catchAsync(async (req, res, next) => {
  const vendorId = req.user.id;
  const orderId = req.params.id;

  // Get vendor's products
  const vendorProducts = await Product.find({ vendor: vendorId }).select('_id');
  const vendorProductIds = vendorProducts.map(p => p._id);

  const order = await Order.findById(orderId)
    .populate({
      path: 'items.product',
      select: 'name price images category brand vendor'
    })
    .populate('user', 'username email firstName lastName');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check if order contains vendor's products
  const vendorItems = order.items.filter(item =>
    item.product && vendorProductIds.some(id => id.equals(item.product._id))
  );

  if (vendorItems.length === 0) {
    return next(new AppError('Not authorized to view this order', 403));
  }

  const vendorSubtotal = vendorItems.reduce((sum, item) => sum + (item.total || 0), 0);

  const filteredOrder = {
    _id: order._id,
    orderNumber: order.orderNumber,
    user: order.user,
    items: vendorItems,
    shippingAddress: order.shippingAddress,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    tax: order.tax,
    total: order.total,
    vendorSubtotal,
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };

  res.status(200).json({
    success: true,
    order: filteredOrder
  });
});

// Update order status
export const updateOrderStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const orderId = req.params.id;
  const vendorId = req.user.id;

  const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid order status', 400));
  }

  // Get vendor's products
  const vendorProducts = await Product.find({ vendor: vendorId }).select('_id');
  const vendorProductIds = vendorProducts.map(p => p._id);

  const order = await Order.findById(orderId)
    .populate('items.product');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check if order contains vendor's products
  const hasVendorProducts = order.items.some(item =>
    item.product && vendorProductIds.some(id => id.equals(item.product._id))
  );

  if (!hasVendorProducts) {
    return next(new AppError('Not authorized to update this order', 403));
  }

  // Validate status transitions
  const currentStatus = order.status;
  const allowedTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: []
  };

  if (!allowedTransitions[currentStatus]?.includes(status)) {
    return next(new AppError(
      `Cannot change status from "${currentStatus}" to "${status}"`,
      400
    ));
  }

  // Update order status
  await order.updateStatus(status);

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    order: {
      _id: order._id,
      status: order.status,
      updatedAt: order.updatedAt
    }
  });
});