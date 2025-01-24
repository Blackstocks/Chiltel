import express from "express";
import {
	addProduct,
	removeProduct,
	getProduct,
	listProducts,
	updateProduct,
	getPendingProducts,
	approveProduct,
	rejectProduct,
} from "../controllers/productController.js";
import { protect, authorize } from "../middleware/adminAuthMiddleware.js";

const productRouter = express.Router();

productRouter.post("/add", protect, authorize(['super-admin', 'sub-admin']), addProduct);
productRouter.delete("/remove/:id", protect, authorize(['super-admin', 'sub-admin']), removeProduct);
productRouter.put("/update/:id", protect, authorize(['super-admin', 'sub-admin']), updateProduct);
productRouter.get("/getPendingProducts", protect, authorize(['super-admin', 'sub-admin']), getPendingProducts);
productRouter.put("/approve/:id", protect, authorize(['super-admin', 'sub-admin']), approveProduct);
productRouter.put("/reject/:id", protect, authorize(['super-admin', 'sub-admin']), rejectProduct);
productRouter.get("/single", getProduct);
productRouter.get("/list", listProducts);

export default productRouter;
