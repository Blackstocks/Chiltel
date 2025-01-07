// routes/sellerRoutes.js
import express from "express";
import {
  register,
  login,
  verifyToken,
  getProfile,
  updateProfile,
  addProduct,
  deleteProduct,
  approveSeller,
  rejectSeller,
  getSellers,
  uploadDocuments,
  deleteDocument,
  getSellerProducts,
  editProduct,
} from "../controllers/sellerController.js";
import { protectSeller } from "../middleware/sellerAuth.js";
import { validateSellerRegistration } from "../middleware/sellerValidation.js";
import upload from "../middleware/sellerDocUpload.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Auth routes
router.post("/register", validateSellerRegistration, register);
router.post("/login", login);

router.put("/approve/:id", adminAuth, approveSeller);
router.put("/reject/:id", adminAuth, rejectSeller);
router.get("/list", adminAuth, getSellers);

// Protected routes
router.use(protectSeller);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/verify", verifyToken);
router.post("/upload-document", upload.single("document"), uploadDocuments);
router.delete("/delete-document", deleteDocument);

router.post("/addProduct", addProduct);
router.get("/getSellerProducts", getSellerProducts);
router.delete("/deleteSellerProduct/:id", deleteProduct);
router.put("/editSellerProducts/:id", editProduct);

export default router;
