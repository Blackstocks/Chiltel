import mongoose from "mongoose";
// Service Request Schema
const serviceRequestSchema = {
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	service: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Service",
		required: true,
		// type: Number
	},
	rider: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Rider",
	},
	status: {
		type: String,
		enum: [
			"CREATED",
			"ASSIGNED",
			"REQUESTED",
			"IN_PROGRESS",
			"COMPLETED",
			"CANCELLED",
		],
		default: "CREATED",
	},
	userLocation: {
		type: {
			type: String,
			enum: ["Point"],
			default: "Point",
		},
		coordinates: [Number], // [longitude, latitude]
		address: String,
	},
	scheduledFor: Date,
	price: Number,
	paymentStatus: {
		type: String,
		enum: ["PENDING", "PAID", "REFUNDED"],
		default: "PENDING",
	},
	paymentDetails: {
		method: String,
		transactionId: String,
		paidAt: Date,
	},
	remarks: String,
	completedAt: Date,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
};

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest;
