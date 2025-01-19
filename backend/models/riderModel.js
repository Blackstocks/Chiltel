// Rider Schema
import mongoose from "mongoose";
import { productEnums } from "../constants/index.js";

const riderSchema = {
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
	phoneNumber: { type: String, required: true },
	fatherName: { type: String, required: true },
	dateOfBirth: { type: Date, required: true },
	imageUrl: { type: String, required: true },
	address: { type: String, required: true },
	panNumber: { type: String, required: true },
	bankDetails: {
		accountNumber: { type: String, required: true },
		ifscCode: { type: String, required: true },
		mobileNumber: { type: String, required: true },
		holderName: { type: String, required: true },
	},
	specializations: [
		{
			type: String,
			enum: productEnums,
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
		completed: { type: Number, default: 0 },
		total: { type: Number, default: 0 },
	},
	rating: {
		average: { type: Number, default: 0 },
		count: { type: Number, default: 0 },
	},
	balance: { type: Number, default: 0 },

	earning: {
		total: { type: Number, default: 0 },
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

	attendance: {
		leaves: [
			{
				date: { type: Date, required: true },
				reason: { type: String, required: true },
			},
		],
		present: [
			{
				date: { type: Date, required: true },
			},
		],
	},
};

const Rider = mongoose.model("Rider", riderSchema);

export default Rider;
