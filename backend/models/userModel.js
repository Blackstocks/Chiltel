import mongoose from "mongoose";
import Cart from "./cartModel.js";

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		phoneNumber: { type: String, required: true },
		address: {
			street: String,
			city: String,
			state: String,
			zipCode: String,
		},
		registeredAt: { type: Date, default: Date.now },
		orders: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Order",
			},
		],
		serviceRequests: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "ServiceRequest",
			},
		],
	},
	{ minimize: false }
);

const userModel = mongoose.model("User", userSchema);
// const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;

userSchema.pre("save", async function (next) {
	if (this.isNew) {
		const cart = new Cart({ userId: this._id });
		await cart.save();
		this.cartId = cart._id;
	}
	next();
});
