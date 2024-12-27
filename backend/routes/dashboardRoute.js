import express from 'express'
const dashboardRouter = express.Router();
import { getDashboardStats, getSalesData, getRecentOrders } from '../controllers/dashboardController.js';
import adminAuth from '../middleware/adminAuth.js';

dashboardRouter.get('/stats', adminAuth, getDashboardStats);
dashboardRouter.get('/sales', adminAuth, getSalesData); 
dashboardRouter.get('/recent-orders', adminAuth, getRecentOrders);

export default dashboardRouter;