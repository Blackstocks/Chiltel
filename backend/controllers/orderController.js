import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModel.js";
import serviceRequestModel from "../models/serviceRequestModel.js";
import Stripe from "stripe";
import razorpay from "razorpay";

// global variables
const currency = "inr";
const deliveryCharge = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const razorpayInstance = new razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Placing orders using COD Method
const placeOrder = async (req, res) => {
	try {
		const {
			userId,
			orderType,
			products,
			services,
			totalAmount,
			paymentDetails,
			phone,
			deliveryCharge,
			orderFirstName,
			orderLastName,
			orderEmail,
			address,
			cart,
			cartId,
		} = req.body;

		console.log("cart: ", req.body);

		const orderData = {
			userId,
			orderType,
			products,
			services,
			totalAmount,
			status: "ORDERED",
			paymentDetails,
			address,
			deliveryCharge: deliveryCharge || 0,
			orderFirstName: orderFirstName,
			orderLastName: orderLastName,
			phoneNumber: phone,
			orderEmail: orderEmail,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const newOrder = new orderModel(orderData);
		await newOrder.save();

		if (cart) {
			console.log("cartId: ", cartId);
			await cartModel.findByIdAndUpdate(cartId, {
				items: [],
				totalAmount: 0,
			});
		}

		res.json({ success: true, message: "Order Placed" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
	try {
		const { userId, items, amount, address } = req.body;
		const { origin } = req.headers;

		const orderData = {
			userId,
			items,
			address,
			amount,
			paymentMethod: "Stripe",
			payment: false,
			date: Date.now(),
		};

		const newOrder = new orderModel(orderData);
		await newOrder.save();

		const line_items = items.map((item) => ({
			price_data: {
				currency: currency,
				product_data: {
					name: item.name,
				},
				unit_amount: item.price * 100,
			},
			quantity: item.quantity,
		}));

		line_items.push({
			price_data: {
				currency: currency,
				product_data: {
					name: "Delivery Charges",
				},
				unit_amount: deliveryCharge * 100,
			},
			quantity: 1,
		});

		const session = await stripe.checkout.sessions.create({
			success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
			cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
			line_items,
			mode: "payment",
		});

		res.json({ success: true, session_url: session.url });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// Verify Stripe
const verifyStripe = async (req, res) => {
	const { orderId, success, userId } = req.body;

	try {
		if (success === "true") {
			await orderModel.findByIdAndUpdate(orderId, { payment: true });
			await userModel.findByIdAndUpdate(userId, { cartData: {} });
			res.json({ success: true });
		} else {
			await orderModel.findByIdAndDelete(orderId);
			res.json({ success: false });
		}
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {
	try {
		const {
			userId,
			orderType,
			products,
			services,
			totalAmount,
			paymentDetails,
			address,
		} = req.body;

		const orderData = {
			userId,
			orderType,
			products,
			services,
			totalAmount,
			status: "PENDING",
			paymentDetails,
			address,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const newOrder = new orderModel(orderData);
		await newOrder.save();

		console.log("newOrder: ", totalAmount * 100);
		const options = {
			amount: parseInt(totalAmount * 100),
			currency: currency.toUpperCase(),
			receipt: newOrder._id.toString(),
		};

		// const order = await razorpayInstance.orders.create(options, (error,order)=>{
		//     if (error) {
		//         console.log('here: ',error)
		//         return res.json({success:false, message: error})
		//     }
		// })

		const order = await razorpayInstance.orders.create(options);

		console.log("order: ", order);

		newOrder.paymentDetails = {
			transactionId: order.receipt,
			method: "Razorpay",
			paidAt: null,
		};
		await newOrder.save();

		res.json({ success: true, order, newOrder });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

const verifyRazorpay = async (req, res) => {
	try {
		const { serviceRequestId, razorpay_order_id, cart, cartId } = req.body;
		console.log("ServiceRequestId: ", serviceRequestId);

		const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
		if (orderInfo.status === "paid") {
			console.log("order info post payment: ", orderInfo);
			await orderModel.findOneAndUpdate(
				{ "paymentDetails.transactionId": orderInfo.receipt },
				{ status: "ORDERED", "paymentDetails.paidAt": new Date() }
			); // added time here
			if (serviceRequestId) {
				await serviceRequestModel.findOneAndUpdate(
					{ _id: serviceRequestId },
					{
						status: "IN_PROGRESS",
						paymentStatus: "PAID",
					}
				);
			} else {
				if (cart) {
					console.log("cartId: ", cartId);
					await cartModel.findByIdAndUpdate(cartId, {
						items: [],
						totalAmount: 0,
					});
				}
			}
			// await orderModel.findByIdAndUpdate(orderInfo.receipt,{payment:true});
			// await userModel.findByIdAndUpdate(userId,{cartData:{}})
			res.json({ success: true, message: "Payment Successful", orderInfo });
		} else {
			res.json({ success: false, message: "Payment Failed" });
		}
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// All Orders data for Admin Panel
const allOrders = async (req, res) => {
	try {
		const orders = await orderModel
			.find({ orderType: "product" })
			.populate({
				path: "userId", // Path to populate
				model: "User",
			})
			.populate({
				path: "products.product", // Path to populate
				model: "Product", // Model to populate from
				// Add nested populate here
				populate: {
					path: "seller",
					model: "Seller",
				},
			});
		res.json({ success: true, orders });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// User Order Data For Forntend
const userOrders = async (req, res) => {
	try {
		const { userId } = req.body;

		const orders = await orderModel.find({ userId }).populate({
			path: "products.product", // Path to populate
			model: "Product", // Model to populate from
		});
		res.json({ success: true, orders });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// update order status from Admin Panel
const updateStatus = async (req, res) => {
	try {
		const { orderId, status } = req.body;

		await orderModel.findByIdAndUpdate(orderId, { status });
		res.json({ success: true, message: "Status Updated" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, message: error.message });
	}
};

// cancel an order
const cancelOrder = async (req, res) => {
	try {
		const { orderId } = req.body;
		const order = await orderModel.findById(orderId);
		if (!order) {
			res.json({
				success: false,
				message: "Order not found",
			});
		} else {
			if (order.status === "ORDERED") {
				console.log("order: ", order);
				if (order.paymentDetails.method === "Razorpay") {
					res.json({
						success: false,
						message: "Cannot cancel an order that has been paid",
					});
				} else {
					// order.status = "CANCELLED";
					await orderModel.findByIdAndUpdate(orderId, { status: "CANCELLED" });
					res.json({
						success: true,
						message: "Order cancelled",
					});
				}
			} else {
				console.log(order);
				console.log(order.status);
				res.json({
					success: false,
					message: "Cannot cancel this order",
				});
			}
		}
	} catch (err) {
		console.log(err);
		res.json({
			success: false,
			message: err.message,
		});
	}
};

// delete an order
const deleteOrder = async (req, res) => {
	try {
		const { orderId } = req.body;
		await orderModel.findByIdAndDelete(orderId);
		res.json({
			success: true,
			message: "Order cancelled",
		});
	} catch (err) {
		console.log(err);
		res.json({
			success: false,
			message: err.message,
		});
	}
};

export {
	verifyRazorpay,
	verifyStripe,
	placeOrder,
	placeOrderStripe,
	placeOrderRazorpay,
	allOrders,
	userOrders,
	updateStatus,
	cancelOrder,
	deleteOrder,
};
