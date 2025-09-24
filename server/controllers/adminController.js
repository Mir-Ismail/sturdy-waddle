import User from "../models/user.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: "buyer" });
    const vendorCount = await User.countDocuments({ role: "vendor" });
    const productCount = await Product.countDocuments({ status: "active" });
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue and sales trend
    const orders = await Order.find();
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.price * order.quantity,
      0
    );

    // Build daily sales trend for all orders
    const trendMap = new Map();
    orders.forEach((order) => {
      const d = new Date(order.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const amount = order.price * order.quantity;
      trendMap.set(key, (trendMap.get(key) || 0) + amount);
    });
    const salesTrend = Array.from(trendMap.entries())
      .map(([date, sales]) => ({ date, sales }))
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

    res.json({
      userCount,
      vendorCount,
      productCount,
      totalOrders,
      totalRevenue,
      salesTrend,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching stats", error: error.message });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "buyer" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

// Get all vendors
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({ role: "vendor" })
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(vendors);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching vendors", error: error.message });
  }
};

// Get supply and purchase details
export const getSupplyPurchaseDetails = async (req, res) => {
  try {
    // Get all products with vendor info
    const products = await Product.find()
      .populate("vendor", "username email")
      .sort({ createdAt: -1 });

    // Get all orders with user and vendor info
    const orders = await Order.find()
      .populate("user", "username email")
      .populate("vendor", "username email")
      .populate("product")
      .sort({ date: -1 });

    res.json({
      products,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching supply/purchase details",
      error: error.message,
    });
  }
};

// Revoke a product (admin only)
export const revokeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: "revoked" },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product revoked successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error revoking product", error: error.message });
  }
};

// Reactivate a product
export const reactivateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: "active" },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product reactivated successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error reactivating product", error: error.message });
  }
};

// Get all products for moderation
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "username email")
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching user", 
      error: error.message 
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role, status } = req.body;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;
    if (status !== undefined) updateData.status = status;
    
    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating user", 
      error: error.message 
    });
  }
};

// Suspend user
export const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndUpdate(
      id, 
      { status: "suspended" }, 
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User suspended successfully", user });
  } catch (error) {
    res.status(500).json({ 
      message: "Error suspending user", 
      error: error.message 
    });
  }
};

// Activate user
export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndUpdate(
      id, 
      { status: "active" }, 
      { new: true }
    ).select("-password");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({ message: "User activated successfully", user });
  } catch (error) {
    res.status(500).json({ 
      message: "Error activating user", 
      error: error.message 
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findByIdAndDelete(id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // If user is a vendor, also delete their products
    if (user.role === "vendor") {
      await Product.deleteMany({ vendor: id });
    }
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting user", 
      error: error.message 
    });
  }
};

// Get vendor by ID with products
export const getVendorById = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await User.findById(id).select("-password");
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    
    // Get vendor's products
    const products = await Product.find({ vendor: id });
    
    res.json({ vendor, products });
  } catch (error) {
    res.status(500).json({ 
      message: "Error fetching vendor", 
      error: error.message 
    });
  }
};

// Update vendor
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, status } = req.body;
    
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (status !== undefined) updateData.status = status;
    
    const vendor = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    
    res.json({ message: "Vendor updated successfully", vendor });
  } catch (error) {
    res.status(500).json({ 
      message: "Error updating vendor", 
      error: error.message 
    });
  }
};

// Suspend vendor
export const suspendVendor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await User.findByIdAndUpdate(
      id, 
      { status: "suspended" }, 
      { new: true }
    ).select("-password");
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    
    // Also suspend all vendor's products
    await Product.updateMany(
      { vendor: id },
      { status: "suspended" }
    );
    
    res.json({ message: "Vendor suspended successfully", vendor });
  } catch (error) {
    res.status(500).json({ 
      message: "Error suspending vendor", 
      error: error.message 
    });
  }
};

// Activate vendor
export const activateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await User.findByIdAndUpdate(
      id, 
      { status: "active" }, 
      { new: true }
    ).select("-password");
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    
    // Also activate all vendor's products
    await Product.updateMany(
      { vendor: id },
      { status: "active" }
    );
    
    res.json({ message: "Vendor activated successfully", vendor });
  } catch (error) {
    res.status(500).json({ 
      message: "Error activating vendor", 
      error: error.message 
    });
  }
};

// Delete vendor
export const deleteVendor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await User.findByIdAndDelete(id);
    
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }
    
    // Also delete all vendor's products
    await Product.deleteMany({ vendor: id });
    
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ 
      message: "Error deleting vendor", 
      error: error.message 
    });
  }
};

export const createAdmin = async () => {
  try {
    const adminEmail = "admin@example.com";
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      await User.create({
        username: "admin",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin",
      });
      console.log("✅ Admin user created successfully.");
    } else {
      console.log("ℹ️  Admin user already exists.");
    }
  } catch (err) {
    console.error("❌ Error creating default admin user:", err);
  }
};
