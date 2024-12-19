// Rider Schema
import mongoose from "mongoose";

const riderSchema = {
	name: String,
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
			ref: "ServiceRequest",
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
			required: true,
		},
	},
};

const Rider = mongoose.model("Rider", riderSchema);

export default Rider;
