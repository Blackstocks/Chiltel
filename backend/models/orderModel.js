import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	products: [
		{
			product: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Product",
			},
			quantity: Number,
			price: Number,
		},
	],
	totalAmount: Number,
	status: {
		type: String,
		enum: ["PENDING", "ORDERED", "DELIVERED"],
		default: "PENDING",
	},
	paymentDetails: {
		method: String,
		transactionId: String,
		paidAt: Date,
	},
	address: {
		street: String,
		city: String,
		state: String,
		zipCode: String,
	},
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

const orderModel =
	mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
