// routes/sellerRoutes.js
import express from "express";
import {
  register,
  login,
  verifyToken,
  getProfile,
  updateProfile,
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductById,
  getProductStats,
  approveSeller,
  rejectSeller,
  getSellers,
} from "../controllers/sellerController.js";
import { protectSeller } from "../middleware/sellerAuth.js";
import { validateSellerRegistration } from '../middleware/sellerValidation.js';
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Auth routes
router.post("/register", validateSellerRegistration, register);
router.post("/login", login);



router.put('/approve/:id', adminAuth, approveSeller);
router.put('/reject/:id', adminAuth, rejectSeller);
router.get('/list', adminAuth, getSellers);

// Protected routes
router.use(protectSeller);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/verify", verifyToken);

router.post('/add', addProduct);
router.get('/list', getProducts);
router.get('/stats', getProductStats);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
