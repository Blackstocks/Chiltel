import Product from "../models/productModel.js";
import Service from "../models/serviceModel.js";
import OrderModel from "../models/orderModel.js";
import Rider from "../models/riderModel.js";

const getDashboardStats = async (req, res) => {
  try {
    const [products, services, orders, riders] = await Promise.all([
      Product.countDocuments(),
      Service.countDocuments(),
      OrderModel.countDocuments(),
      Rider.countDocuments(),
    ]);

    res.json({
      products,
      services,
      orders,
      riders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSalesData = async (req, res) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          sales: { $sum: "$totalAmount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                months: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
              },
              in: {
                $arrayElemAt: ["$$months", { $subtract: ["$_id.month", 1] }],
              },
            },
          },
          sales: 1,
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json(salesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name")
      .populate("product", "name");

    const formattedOrders = recentOrders.map((order) => ({
      id: order._id,
      customer: order.customer.name,
      product: order.product.name,
      date: order.createdAt.toISOString().split("T")[0],
      status: order.status,
    }));

    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getDashboardStats, getSalesData, getRecentOrders };
