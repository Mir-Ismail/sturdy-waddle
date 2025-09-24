import express from "express";
import { getAllProducts, getProductById, getProductsByCategory, searchProducts, getNewArrivals, getDeals } from "../controllers/productController.js";

const router = express.Router();

// Get all products (public)
router.get("/", getAllProducts);

// Search products (public)
router.get("/search", searchProducts);

// New arrivals and deals (must come before /:id)
router.get("/new-arrivals", getNewArrivals);
router.get("/deals", getDeals);

// Get products by category (public) - must come before /:id route
router.get("/category/:category", getProductsByCategory);

// Get product by ID (public) - must come after more specific routes
router.get("/:id", getProductById);

export default router; 