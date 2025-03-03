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
	verifyBankDetails,
	verifyGST,
} from "../controllers/sellerController.js";
import { protectSeller } from "../middleware/sellerAuth.js";
import { validateSellerRegistration } from "../middleware/sellerValidation.js";
import { protect, authorize } from "../middleware/adminAuthMiddleware.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Auth routes
router.post("/register", validateSellerRegistration, register);
router.post("/login", login);

router.put(
	"/approve/:id",
	protect,
	authorize(["super-admin", "sub-admin"]),
	approveSeller
);
router.put(
	"/reject/:id",
	protect,
	authorize(["super-admin", "sub-admin"]),
	rejectSeller
);
router.get(
	"/list",
	protect,
	authorize(["super-admin", "sub-admin"]),
	getSellers
);
router.put(
	"/update-commision/:id",
	protect,
	authorize(["super-admin", "sub-admin"]),
	updateCommission
);

// Protected routes
router.use(protectSeller);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.post("/verify-bank-details", verifyBankDetails);
router.get("/verify", verifyToken);
router.post("/upload-document", upload.single("document"), uploadDocument);

router.post("/addProduct", addProduct);
router.get("/getSellerProducts", getSellerProducts);
router.get("/getSellerOrders", getSellerOrders);
router.delete("/deleteSellerProduct/:id", deleteProduct);
router.put("/editSellerProduct/:id", editProduct);
router.post("/verify-gst", verifyGST);

export default router;
