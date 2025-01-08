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
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import { get } from "mongoose";

const productRouter = express.Router();

productRouter.post("/add", adminAuth, addProduct);
productRouter.delete("/remove/:id", adminAuth, removeProduct);
productRouter.put("/update/:id", adminAuth, updateProduct);
productRouter.get("/getPendingProducts", adminAuth, getPendingProducts);
productRouter.put("/approve/:id", adminAuth, approveProduct);
productRouter.put("/reject/:id", adminAuth, rejectProduct);
productRouter.get("/single", getProduct);
productRouter.get("/list", listProducts);

export default productRouter;
