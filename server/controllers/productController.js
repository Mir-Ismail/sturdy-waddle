import Product from "../models/product.js";

// Get all products (public)
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" })
      .populate("vendor", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
      count: products.length,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};

// Get product by ID (public)
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Server: Fetching product with ID:", id);

    const product = await Product.findById(id).populate(
      "vendor",
      "username email"
    );

    if (!product) {
      console.log("Server: Product not found for ID:", id);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    console.log("Server: Product found:", product.name);
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching product",
      error: error.message,
    });
  }
};

// Get products by category (public)
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Convert category from URL format to readable format
    const categoryName = category.replace(/-/g, " ");

    const products = await Product.find({
      category: { $regex: new RegExp(categoryName, "i") },
      status: "active",
    })
      .populate("vendor", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
      count: products.length,
      category: categoryName,
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products by category",
      error: error.message,
    });
  }
};

// Search products (public)
export const searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        products: [],
        count: 0,
      });
    }

    const searchQuery = {
      $or: [
        { name: { $regex: new RegExp(q, "i") } },
        { description: { $regex: new RegExp(q, "i") } },
        { category: { $regex: new RegExp(q, "i") } },
        { brand: { $regex: new RegExp(q, "i") } },
      ],
      status: "active",
    };

    const products = await Product.find(searchQuery)
      .populate("vendor", "username email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      products,
      count: products.length,
      query: q,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Error searching products",
      error: error.message,
    });
  }
};

// New: Get new arrivals (public) - return array for client compatibility
export const getNewArrivals = async (req, res) => {
  try {
    // Last 30 days, newest first, cap to 24
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const products = await Product.find({
      status: "active",
      createdAt: { $gte: thirtyDaysAgo },
    })
      .sort({ createdAt: -1 })
      .limit(24);

    // Return raw array (client expects array)
    res.json(products);
  } catch (error) {
    console.error("Error fetching new arrivals:", error);
    res.status(500).json({ message: "Error fetching new arrivals", error: error.message });
  }
};

// New: Get today's deals (public) - return array for client compatibility
export const getDeals = async (req, res) => {
  try {
    // Products where originalPrice exists and is greater than current price
    const products = await Product.find({
      status: "active",
      originalPrice: { $exists: true, $gt: 0 },
      $expr: { $gt: ["$originalPrice", "$price"] },
    })
      .sort({ updatedAt: -1 })
      .limit(24);

    // Return raw array (client expects array)
    res.json(products);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ message: "Error fetching deals", error: error.message });
  }
};
