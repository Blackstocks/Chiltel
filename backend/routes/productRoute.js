import express from 'express'
import {addProduct, removeProduct, getProduct, listProducts} from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/',adminAuth, addProduct);
productRouter.delete('/remove',adminAuth, removeProduct);
productRouter.get('/single', getProduct);
productRouter.get('/list', listProducts);

export default productRouter