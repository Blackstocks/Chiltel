// backend/models/cartModel.js
import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
	productId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	category: {
		type: String,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
		min: 1,
	},
	price: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
});

const cartSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		items: [cartItemSchema],
		totalAmount: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Calculate total amount before saving
// cartSchema.pre("save", function (next) {
// 	this.totalAmount = this.items.reduce((total, item) => {
// 		return total + item.price * item.quantity;
// 	}, 0);
// 	next();
// });

cartSchema.pre("save", function (next) {
	// Calculate total amount and round to two decimal places
	this.totalAmount = parseInt(
		this.items.reduce((total, item) => {
			return total + item.price * item.quantity;
		}, 0)
	);
	next();
});


const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
