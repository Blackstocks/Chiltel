// controllers/serviceRequestController.js
import ServiceRequest from "../models/serviceRequestModel.js";
import mongoose from "mongoose";
import razorpay from "razorpay";

const razorpayInstance = new razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const serviceRequestController = {
	// Create a new service request
	createServiceRequest: async (req, res) => {
		try {
			console.log(req.body);
			const {
				user,
				services,
				userLocation,
				scheduledFor,
				totalPrice,
				remarks,
				paymentId,
			} = req.body;

			console.log("paymentId: ", paymentId);

			if (!paymentId) {
				return res.status(400).json({ message: "Payment Id is required" });
			}

			// Wait for payment verification
			let payment;
			try {
				payment = await razorpayInstance.payments.fetch(paymentId);
			} catch (error) {
				console.log("Payment verification failed", error);
				return res.status(500).json({
					message: "Payment verification failed",
					error: error.message,
				});
			}

			console.log("Payment info", payment);

			if (payment.status !== "captured") {
				return res.status(400).json({ message: "Payment not captured" });
			}

			console.log("services: ", services);

			const serviceRequest = new ServiceRequest({
				user,
				services,
				userLocation,
				scheduledFor: new Date(scheduledFor),
				price: totalPrice,
				paymentStatus: "PAID",
				paymentDetails: {
					method: "RAZORPAY",
					transactionId: paymentId,
				},
				remarks,
			});

			await serviceRequest.save();

			res.status(201).json({
				success: true,
				message: "Service request created successfully",
				data: serviceRequest,
			});
		} catch (error) {
			console.log(error);
			res.status(500).json({
				success: false,
				message: "Failed to create service request",
				error: error.message,
			});
		}
	},
	getUserServiceRequests: async (req, res) => {
		try {
			const userId = req.params;
			const serviceRequests = await ServiceRequest.find({
				user: new mongoose.Types.ObjectId(userId.userId),
			})
				.populate("user", "name email phone")
				.populate(
					"services.serviceId",
					"name description price estimatedDuration"
				)
				.populate("rider", "name phone")
				.sort({ createdAt: -1 });

			res.status(200).json({
				success: true,
				count: serviceRequests.length,
				data: serviceRequests,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to fetch user service requests",
				error: error.message,
			});
		}
	},

	// Controller function to get all service requests
	getAllServiceRequests: async (req, res) => {
		try {
			const serviceRequests = await ServiceRequest.find()
				.populate("user")
				.populate("services.serviceId")
				.populate("rider")
				.sort({ createdAt: -1 });

			res.status(200).json({
				success: true,
				count: serviceRequests.length,
				data: serviceRequests,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to fetch service requests",
				error: error.message,
			});
		}
	},

	// Get single service request by ID
	getServiceRequestById: async (req, res) => {
		try {
			const { id } = req.params;

			const serviceRequest = await ServiceRequest.findById(id)
				.populate("user", "name email phone")
				.populate("services.serviceId", "name description price")
				.populate("rider", "name phone");

			if (!serviceRequest) {
				return res.status(404).json({
					success: false,
					message: "Service request not found",
				});
			}

			res.status(200).json({
				success: true,
				data: serviceRequest,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to fetch service request",
				error: error.message,
			});
		}
	},

	// Update service request
	updateServiceRequest: async (req, res) => {
		try {
			const { id } = req.params;
			const updateData = req.body;

			const serviceRequest = await ServiceRequest.findByIdAndUpdate(
				id,
				{
					...updateData,
					updatedAt: new Date(),
				},
				{ new: true, runValidators: true }
			);

			if (!serviceRequest) {
				return res.status(404).json({
					success: false,
					message: "Service request not found",
				});
			}

			res.status(200).json({
				success: true,
				message: "Service request updated successfully",
				data: serviceRequest,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to update service request",
				error: error.message,
			});
		}
	},

	// Assign rider to service request
	assignRider: async (req, res) => {
		try {
			const { id } = req.params;
			const { riderId } = req.body;

			// First check if the service request exists
			const existingRequest = await ServiceRequest.findById(id);
			if (!existingRequest) {
				return res.status(404).json({
					success: false,
					message: "Service request not found",
				});
			}

			// Add rider to requestedRiders array if not already present
			if (!existingRequest.requestedRiders.includes(riderId)) {
				existingRequest.requestedRiders.push(riderId);
			}

			// Update the service request
			const serviceRequest = await ServiceRequest.findByIdAndUpdate(
				id,
				{
					rider: null,
					status: "ASSIGNED",
					requestedRiders: existingRequest.requestedRiders,
					updatedAt: new Date(),
				},
				{ new: true, runValidators: true }
			).populate("rider"); // Optionally populate rider details

			res.status(200).json({
				success: true,
				message: "Rider assigned successfully",
				data: serviceRequest,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to assign rider",
				error: error.message,
			});
		}
	},

	// Assign multiple riders to service request
	assignMultipleRiders: async (req, res) => {
		try {
			const { id } = req.params;
			const { riderIds } = req.body;

			// Validate input
			if (!Array.isArray(riderIds) || riderIds.length === 0) {
				return res.status(400).json({
					success: false,
					message: "Please provide an array of rider IDs",
				});
			}

			// First check if the service request exists
			const existingRequest = await ServiceRequest.findById(id);
			if (!existingRequest) {
				return res.status(404).json({
					success: false,
					message: "Service request not found",
				});
			}

			// Filter out duplicate riders and combine with existing requested riders
			const uniqueRiders = [
				...new Set([...existingRequest.requestedRiders, ...riderIds]),
			];

			// Update the service request
			const serviceRequest = await ServiceRequest.findByIdAndUpdate(
				id,
				{
					rider: null,
					status: "ASSIGNED",
					requestedRiders: uniqueRiders,
					updatedAt: new Date(),
				},
				{
					new: true,
					runValidators: true,
				}
			).populate("requestedRiders", "rider"); // Populate all requested riders' details

			res.status(200).json({
				success: true,
				message: "Multiple riders assigned successfully",
				data: {
					serviceRequest,
					totalRidersAssigned: uniqueRiders.length,
				},
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to assign multiple riders",
				error: error.message,
			});
		}
	},

	// Update payment status and details
	updatePaymentStatus: async (req, res) => {
		try {
			const { id } = req.params;
			const { paymentStatus, paymentDetails } = req.body;

			const serviceRequest = await ServiceRequest.findByIdAndUpdate(
				id,
				{
					paymentStatus,
					paymentDetails: {
						...paymentDetails,
						paidAt: new Date(),
					},
					updatedAt: new Date(),
				},
				{ new: true, runValidators: true }
			);

			if (!serviceRequest) {
				return res.status(404).json({
					success: false,
					message: "Service request not found",
				});
			}

			res.status(200).json({
				success: true,
				message: "Payment status updated successfully",
				data: serviceRequest,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to update payment status",
				error: error.message,
			});
		}
	},

	// Cancel service request
	cancelServiceRequest: async (req, res) => {
		try {
			const { id } = req.params;
			const { cancelReason } = req.body;

			const serviceRequest = await ServiceRequest.findByIdAndUpdate(
				id,
				{
					status: "CANCELLED",
					remarks: cancelReason,
					updatedAt: new Date(),
				},
				{ new: true, runValidators: true }
			);

			if (!serviceRequest) {
				return res.status(404).json({
					success: false,
					message: "Service request not found",
				});
			}

			res.status(200).json({
				success: true,
				message: "Service request cancelled successfully",
				data: serviceRequest,
			});
		} catch (error) {
			res.status(500).json({
				success: false,
				message: "Failed to cancel service request",
				error: error.message,
			});
		}
	},
};
