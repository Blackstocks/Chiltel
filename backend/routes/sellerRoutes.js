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
  getSellerProducts,
  editProduct,
  getSellerOrders,
  uploadDocument,
  updateCommission,
} from "../controllers/sellerController.js";
import { protectSeller } from "../middleware/sellerAuth.js";
import { validateSellerRegistration } from "../middleware/sellerValidation.js";
import adminAuth from "../middleware/adminAuth.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Auth routes
router.post("/register", validateSellerRegistration, register);
router.post("/login", login);

router.put("/approve/:id", adminAuth, approveSeller);
router.put("/reject/:id", adminAuth, rejectSeller);
router.get("/list", adminAuth, getSellers);
router.put("/update-commision/:id", adminAuth, updateCommission);



// Protected routes
router.use(protectSeller);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/verify", verifyToken);
router.post("/upload-document", upload.single("document"), uploadDocument);


router.post("/addProduct", addProduct);
router.get("/getSellerProducts", getSellerProducts);
router.get("/getSellerOrders", getSellerOrders);
router.delete("/deleteSellerProduct/:id", deleteProduct);
router.put("/editSellerProducts/:id", editProduct);

export default router;
