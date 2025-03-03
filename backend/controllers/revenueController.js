import Order from '../models/orderModel.js';
import Seller from '../models/seller.js';

export const getSellerRevenue = async (req, res) => {
    try {
        const { id: sellerId } = req.params;
        console.log("Seller ID:", sellerId);
        
        // First, fetch the seller to get the commission rate
        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }
        
        // Ensure seller has a commission rate
        const commissionRate = seller.commissionRate || 0;
        
        const orders = await Order.find({ seller: sellerId, status: 'DELIVERED' });
        console.log(`Found ${orders.length} delivered orders for this seller`);
        
        const monthlyRevenue = {};
        let totalAmount = 0;

        orders.forEach(order => {
            // Make sure updatedAt is a valid Date object
            if (!order.updatedAt || !(order.updatedAt instanceof Date)) {
                console.log("Invalid date for order:", order._id);
                return; // Skip this order
            }
            
            const month = order.updatedAt.getMonth() + 1; // getMonth() is zero-based
            const year = order.updatedAt.getFullYear();
            const key = `${year}-${month}`;

            console.log(`Processing order: ${order._id}, Date: ${order.updatedAt}, Key: ${key}`);

            if (!monthlyRevenue[key]) {
                monthlyRevenue[key] = 0;
            }

            // Make sure totalAmount is a number
            const orderAmount = Number(order.totalAmount) || 0;
            monthlyRevenue[key] += orderAmount;
            totalAmount += orderAmount;
        });

        // Calculate seller's revenue after commission
        const overallRevenue = totalAmount * (100 - commissionRate) / 100;
        console.log("Overall revenue after commission:", overallRevenue);

        // Calculate monthly revenue after commission
        for (const key in monthlyRevenue) {
            monthlyRevenue[key] = monthlyRevenue[key] * (100 - commissionRate) / 100;
        }

        res.json({ 
            success: true,
            data: {
                overallRevenue, 
                monthlyRevenue,
                totalOrdersProcessed: orders.length,
                commissionRate
            }
        });
    } catch (error) {
        console.error("Error in getSellerRevenue:", error);
        res.status(500).json({ 
            success: false,
            message: 'Error calculating seller revenue', 
            error: error.message 
        });
    }
};

export const getAdminRevenue = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'DELIVERED' });
        const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const revenue = calculateRevenue(totalAmount, commissions.admin);
        res.json({ commission: commissions.admin, revenue });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating admin revenue', error: error.message });
    }
};

export const getRiderRevenue = async (req, res) => {
    try {
        const orders = await Order.find({ status: 'DELIVERED' });
        const totalAmount = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const revenue = calculateRevenue(totalAmount, commissions.rider);
        res.json({ commission: commissions.rider, revenue });
    } catch (error) {
        res.status(500).json({ message: 'Error calculating rider revenue', error: error.message });
    }
};