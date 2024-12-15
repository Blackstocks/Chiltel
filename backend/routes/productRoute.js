import express from 'express'
import {addProduct} from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add',adminAuth, addProduct);
productRouter.post('/remove',adminAuth, removeProduct);
productRouter.post('/single',singleProduct);
productRouter.get('/list',listProducts)

export default productRouter