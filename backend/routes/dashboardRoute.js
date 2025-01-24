import express from 'express'
const dashboardRouter = express.Router();
import { getDashboardStats, getSalesData, getRecentOrders } from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/adminAuthMiddleware.js';

dashboardRouter.get('/stats', protect, authorize(['super-admin', 'sub-admin']), getDashboardStats);
dashboardRouter.get('/sales', protect, authorize(['super-admin', 'sub-admin']), getSalesData); 
dashboardRouter.get('/recent-orders', protect, authorize(['super-admin', 'sub-admin']), getRecentOrders);

export default dashboardRouter;