import express from 'express';
import {
    getSellerRevenue,
    getAdminRevenue,
    getRiderRevenue
} from '../controllers/revenueController.js';

const router = express.Router();

// Route to get seller commission and revenue
router.get('/seller/:amount', getSellerRevenue);

// Route to get admin commission and revenue
router.get('/admin/:amount', getAdminRevenue);

// Route to get rider commission and revenue
router.get('/rider/:amount', getRiderRevenue);

export default router;