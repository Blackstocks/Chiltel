import express from 'express';
import {
    getSellerRevenue,
    getAdminRevenue,
    getRiderRevenue
} from '../controllers/revenueController.js';

const revenueRouter = express.Router();

// Route to get seller commission and revenue
revenueRouter.get('/seller/:id', getSellerRevenue);

// Route to get admin commission and revenue
revenueRouter.get('/admin/:amount', getAdminRevenue);

// Route to get rider commission and revenue
revenueRouter.get('/rider/:amount', getRiderRevenue);

export default revenueRouter;