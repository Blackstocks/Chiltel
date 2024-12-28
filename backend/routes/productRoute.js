import express from "express";
import {
	addProduct,
	removeProduct,
	getProduct,
	listProducts,
	updateProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const productRouter = express.Router();

productRouter.post("/add", adminAuth, addProduct);
productRouter.delete("/remove/:id", adminAuth, removeProduct);
productRouter.put("/update/:id", adminAuth, updateProduct);
productRouter.get("/single", getProduct);
productRouter.get("/list", listProducts);

export default productRouter;
