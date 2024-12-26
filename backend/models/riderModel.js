// Rider Schema
import mongoose from "mongoose";
import ServiceRequest from "./serviceRequestModel.js";

const riderSchema = {
	firstName: String,
	lastName: String,
	email: { type: String, unique: true },
	password: String,
	phoneNumber: String,
	specialization: {
		type: String,
		enum: ["AC", "Cooler", "Microwave"],
		required: true,
	},
	status: {
		type: String,
		enum: ["AVAILABLE", "BUSY", "OFFLINE"],
		default: "OFFLINE",
	},
	assignedServices: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: ServiceRequest,
		},
	],
	rating: {
		average: { type: Number, default: 0 },
		count: { type: Number, default: 0 },
	},
	location: {
		type: {
			type: String,
			enum: ["Point"],
			default: "Point",
		},
		coordinates: {
			type: [Number], // [longitude, latitude]
		},
	},
};

const Rider = mongoose.model("Rider", riderSchema);

export default Rider;
