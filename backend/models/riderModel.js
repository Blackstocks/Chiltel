// Rider Schema
import mongoose from "mongoose";
import ServiceRequest from "./serviceRequestModel.js";

const riderSchema = {
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	phoneNumber: { type: String, required: true },
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
	AcceptedServices: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: ServiceRequest,
		},
	],
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
