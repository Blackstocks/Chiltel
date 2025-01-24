import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  placeOrderRazorpay,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
  verifyRazorpay,
  cancelOrder,
  deleteOrder,
} from "../controllers/orderController.js";
import authUser from "../middleware/auth.js";
import { protect, authorize } from "../middleware/adminAuthMiddleware.js";

const orderRouter = express.Router();

// Admin Features
orderRouter.post(
  "/list",
  protect,
  authorize(["super-admin", "sub-admin"]),
  allOrders
);
orderRouter.post(
  "/status",
  protect,
  authorize(["super-admin", "sub-admin"]),
  updateStatus
);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/stripe", authUser, placeOrderStripe);
orderRouter.post("/razorpay", authUser, placeOrderRazorpay);

// User Feature
orderRouter.post("/userorders", authUser, userOrders);

// verify payment
orderRouter.post("/verifyStripe", authUser, verifyStripe);
orderRouter.post("/verifyRazorpay", authUser, verifyRazorpay);

// cancel order
orderRouter.post("/cancel", authUser, cancelOrder);

// delete order
orderRouter.post("/delete", authUser, deleteOrder);

export default orderRouter;
