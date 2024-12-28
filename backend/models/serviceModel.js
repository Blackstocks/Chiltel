import mongoose from "mongoose";
import { productEnums } from "../constants/index.js";

// Service Schema
const serviceSchema = {
	name: String,
	description: String,
	price: Number,
	discount: Number,
	product: {
		type: String,
		enum: productEnums,
	},
	category: {
		type: String,
		enum: ["Installation", "Service", "Repair"],
	},
	estimatedDuration: String,
	isAvailable: Boolean,
	rateChart: {
		type: Object,
		default: {},
	},

	requirements: [String],
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
};

const Service = mongoose.model("Service", serviceSchema);

export default Service;
