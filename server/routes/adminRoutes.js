import express from 'express';
import { 
  getDashboardStats, 
  getAllUsers, 
  getAllVendors, 
  getSupplyPurchaseDetails, 
  revokeProduct, 
  reactivateProduct, 
  getAllProducts,
  getUserById,
  updateUser,
  suspendUser,
  activateUser,
  deleteUser,
  getVendorById,
  updateVendor,
  suspendVendor,
  activateVendor,
  deleteVendor
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.put('/users/:id/suspend', suspendUser);
router.put('/users/:id/activate', activateUser);
router.delete('/users/:id', deleteUser);

// Vendor management
router.get('/vendors', getAllVendors);
router.get('/vendors/:id', getVendorById);
router.put('/vendors/:id', updateVendor);
router.put('/vendors/:id/suspend', suspendVendor);
router.put('/vendors/:id/activate', activateVendor);
router.delete('/vendors/:id', deleteVendor);

// Supply and purchase details
router.get('/supply-purchase', getSupplyPurchaseDetails);

// Product moderation
router.get('/products', getAllProducts);
router.put('/products/:id/revoke', revokeProduct);
router.put('/products/:id/reactivate', reactivateProduct);

export default router; 