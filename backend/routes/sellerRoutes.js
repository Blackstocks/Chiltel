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
  rejectSeller
} from "../controllers/sellerController.js";
import { protectSeller } from "../middleware/sellerAuth.js";

const router = express.Router();

// Auth routes
router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyToken);

// Protected routes
router.use(protectSeller);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.put('/approve-seller/:id', approveSeller);
router.put('/reject-seller/:id', rejectSeller);

router.post('/add', addProduct);
router.get('/list', getProducts);
router.get('/stats', getProductStats);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
