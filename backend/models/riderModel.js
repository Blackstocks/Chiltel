// Rider Schema
import mongoose from "mongoose";

const riderSchema = {
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	phoneNumber: { type: String, required: true },
	specializations: [
		{
			type: String,
			enum: ["AC", "Cooler", "Microwave"],
			required: true,
		},
	],
	status: {
		type: String,
		enum: ["AVAILABLE", "BUSY", "OFFLINE"],
		default: "OFFLINE",
	},
	registrationStatus: {
		type: String,
		enum: ["PENDING", "APPROVED", "REJECTED"],
		default: "PENDING",
	},
	services: {
		completed: Number,
		total: Number,
	},
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
