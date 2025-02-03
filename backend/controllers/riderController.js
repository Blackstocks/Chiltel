// src/controllers/rider.controller.js
import Rider from "../models/riderModel.js";
import ServiceRequest from "../models/serviceRequestModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import razorpay from "razorpay";
import crypto, { verify } from "crypto";
import ReferralCode from "../models/referralModel.js";
import bucket from "../config/firebaseConfig.js";
import fs from "fs";

const razorpayInstance = new razorpay({
	key_id: process.env.RAZORPAY_KEY_ID,
	key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const riderController = {
	// Auth Controllers
	async signup(req, res) {
		console.log(req.body);
		try {
			const {
				email,
				password,
				firstName,
				lastName,
				phoneNumber,
				referralCode,
				paymentId,
				mode,
				specializations,
				fatherName,
				dob,
				address,
				state,
				city,
				pincode,
				panNumber,
				beneficiaryAccount,
				beneficiaryIFSC,
				beneficiaryMobile,
				beneficiaryName,
			} = req.body;
			console.log(req.body);

			if (mode === "normal") {
				// //verify referral code
				// if (referralCode) {
				// 	const storedReferralCode = await ReferralCode.findOne({ email });
				// 	if (!storedReferralCode || referralCode !== storedReferralCode.code) {
				// 		return res.status(400).json({ message: "Invalid referral code" });
				// 	}
				// } else {
				// 	return res.status(400).json({ message: "Referral code is required" });
				// }
			}

			if (mode === "commission") {
				if (!paymentId) {
					return res.status(400).json({ message: "Payment Id is required" });
				}

				razorpayInstance.payments.fetch(paymentId, async (error, payment) => {
					if (error) {
						return res
							.status(500)
							.json({ message: "Payment verification failed" });
					}
					console.log(payment);
					if (payment.status !== "captured") {
						return res
							.status(400)
							.json({ message: "Payment verification failed" });
					}
				});
			}

			// Check if rider exists
			let rider = await Rider.findOne({ email });
			if (rider) {
				return res.status(400).json({ message: "Rider already exists" });
			}

			// Create new rider
			rider = new Rider({
				email,
				password,
				firstName,
				lastName,
				fatherName,
				dateOfBirth: dob,
				address: `${address}, ${city}, ${state}, ${pincode}`,
				panNumber,
				bankDetails: {
					accountNumber: beneficiaryAccount,
					ifscCode: beneficiaryIFSC,
					mobileNumber: beneficiaryMobile,
					holderName: beneficiaryName,
				},
				imageUrl: req.file ? req.file.path : "test.link",
				phoneNumber,
				specializations,
				balance: mode === "commission" ? 2000 : 0,
				status: "OFFLINE",
			});

			// Hash password
			const salt = await bcrypt.genSalt(10);
			rider.password = await bcrypt.hash(password, salt);

			await rider.save();

			res.status(201).json({ message: "Registered.... Waiting for approval." });

			// // Generate token
			// const token = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, {
			// 	expiresIn: "30d",
			// });

			// res.status(201).json({
			// 	token,
			// 	user: {
			// 		id: rider._id,
			// 		email: rider.email,
			// 		firstName: rider.firstName,
			// 		lastName: rider.lastName,
			// 		status: rider.status,
			// 	},
			// });
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async createOrder(req, res) {
		try {
			const AMOUNT = 1;
			const CURRENCY = "INR";
			const RECEIPT = `receipt#${Math.floor(Math.random() * 1000000)}`;

			const options = {
				amount: AMOUNT * 100,
				currency: CURRENCY,
				receipt: RECEIPT,
			};

			razorpayInstance.orders.create(options, (error, order) => {
				if (error) {
					return res.status(500).json({ message: "Order creation failed" });
				}

				console.log(order);

				res.json(order);
			});
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async verifyPayment(req, res) {
		try {
			const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
				req.body;
			console.log(req.body);

			const generatedSignature = crypto
				.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
				.update(razorpay_order_id + "|" + razorpay_payment_id)
				.digest("hex");

			console.log("Generated Signature:", generatedSignature);
			console.log("Received Signature:", razorpay_signature);

			if (generatedSignature !== razorpay_signature) {
				return res.status(400).json({ message: "Payment verification failed" });
			}

			res.json({ success: true, message: "Payment verified successfully" });
		} catch (error) {
			console.log(error);
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async login(req, res) {
		try {
			const { email, password } = req.body;

			// Check rider exists
			const rider = await Rider.findOne({ email });
			if (!rider) {
				return res.status(400).json({ message: "Invalid credentials" });
			}

			console.log(rider);

			// Verify password
			const isMatch = bcrypt.compare(password, rider.password);
			if (!isMatch) {
				return res.status(400).json({ message: "Invalid credentials" });
			}

			if (rider.registrationStatus === "PENDING") {
				return res
					.status(400)
					.json({ message: "Registration not approved by the admin" });
			}

			if (rider.registrationStatus === "REJECTED") {
				return res
					.status(400)
					.json({ message: "Registration rejected by the admin" });
			}

			// Update rider status to online
			rider.status = "AVAILABLE";
			await rider.save();

			// Generate token
			const token = jwt.sign({ id: rider._id }, process.env.JWT_SECRET, {
				expiresIn: "30d",
			});

			res.json({
				token,
				user: {
					id: rider._id,
					email: rider.email,
					firstName: rider.firstName,
					lastName: rider.lastName,
					status: rider.status,
				},
			});
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async verifyToken(req, res) {
		try {
			const rider = await Rider.findById(req.rider._id).select("-password");
			res.json(rider);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async logout(req, res) {
		try {
			// Update rider status to offline
			await Rider.findByIdAndUpdate(req.rider._id, { status: "OFFLINE" });
			res.json({ message: "Logged out successfully" });
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	// Profile Controllers
	async getProfile(req, res) {
		try {
			const rider = await Rider.findById(req.rider._id).select("-password");
			res.json(rider);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async updateProfile(req, res) {
		try {
			const updates = req.body;
			delete updates.password; // Prevent password update through this route

			const rider = await Rider.findByIdAndUpdate(
				req.rider._id,
				{ $set: updates },
				{ new: true }
			).select("-password");

			res.json(rider);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async updateLocation(req, res) {
		try {
			const { latitude, longitude } = req.body;
			console.log(req.body);

			// await Rider.findByIdAndUpdate(req.rider._id, {
			// 	location: {
			// 		type: "Point",
			// 		coordinates: [longitude, latitude],
			// 	},
			// });

			res.json({ message: "Location updated successfully" });
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	// Service Controllers
	async getAssignedServices(req, res) {
		try {
			const services = await ServiceRequest.find({
				requestedRiders: { $in: [req.rider._id] },
				status: "ASSIGNED",
			})
				.populate("service", "name estimatedDuration")
				.populate("user", "firstName lastName")
				.select("-OTP");

			res.json(services);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async getActiveService(req, res) {
		try {
			const service = await ServiceRequest.findOne({
				rider: req.rider._id,
				workStarted: true,
			})
				.populate("user", "name phoneNumber address")
				.populate("service", "name rateChart")
				.select("-OTP");

			if (!service) {
				return res.status(404).json({ message: "No service is active now" });
			}

			res.json(service);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async getAcceptedServices(req, res) {
		try {
			const services = await ServiceRequest.find({
				rider: req.rider._id,
				status: "ASSIGNED",
				workStarted: false,
			})
				.populate("service", "name estimatedDuration")
				.populate("user", "name phoneNumber address")
				.select("-OTP");
			if (services.length === 0) {
				return res.status(404).json({ message: "No accepted services found" });
			}
			res.json(services);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async getServiceHistory(req, res) {
		try {
			const { page = 1, limit = 10 } = req.query;

			const services = await ServiceRequest.find({
				rider: req.rider._id,
				status: "COMPLETED",
			})
				.populate("user", "name")
				.populate("service", "name")
				.sort({ completedAt: -1 })
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.select("-OTP");

			const count = await ServiceRequest.countDocuments({
				rider: req.rider._id,
				status: "COMPLETED",
			});

			res.json({
				services,
				totalPages: Math.ceil(count / limit),
				currentPage: page,
			});
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async acceptService(req, res) {
		try {
			const service = await ServiceRequest.findById(req.params.id);

			console.log(service);

			if (!service) {
				return res.status(404).json({ message: "Service not found" });
			}

			if (service.status !== "ASSIGNED") {
				return res.status(400).json({ message: "Service cannot be accepted" });
			}
			const rider = await Rider.findById(req.rider._id);

			service.rider = req.rider._id;
			service.requestedRiders = [];
			rider.services.total += 1;
			await rider.save();
			await service.save();

			console.log(service);

			res.json(service);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async declineService(req, res) {
		try {
			const service = await ServiceRequest.findById(req.params.id);

			if (!service) {
				return res.status(404).json({ message: "Service not found" });
			}

			if (service.status !== "ASSIGNED") {
				return res.status(400).json({ message: "Service cannot be declined" });
			}

			service.requestedRiders = service.requestedRiders.filter(
				(id) => id.toString() !== req.rider._id.toString()
			);
			await service.save();

			res.json(service);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	// async completeService(req, res) {
	// 	try {
	// 		const service = await ServiceRequest.findById(req.params.id);

	// 		if (!service) {
	// 			return res.status(404).json({ message: "Service not found" });
	// 		}

	// 		if (service.status !== "IN_PROGRESS") {
	// 			return res.status(400).json({ message: "Service cannot be completed" });
	// 		}

	// 		const rider = await Rider.findById(req.rider._id);

	// 		service.status = "COMPLETED";
	// 		service.workStarted = false;
	// 		rider.services.completed += 1;
	// 		rider.earning = [
	// 			...rider.earning,
	// 			{ date: new Date(), amount: service.price },
	// 		];
	// 		rider.balance -= 50; // 5 coins deducted (This is in rupees)
	// 		service.completedAt = new Date();
	// 		await service.save();
	// 		await rider.save();

	// 		res.json(service.select("-OTP"));
	// 	} catch (error) {
	// 		res.status(500).json({ message: "Server error", error: error.message });
	// 	}
	// },

	async updateServiceStatus(req, res) {
		try {
			const { status } = req.body;
			const service = await ServiceRequest.findOneAndUpdate(
				{ _id: req.params.id, rider: req.rider._id },
				{ status }
			);

			if (!service) {
				return res.status(404).json({ message: "Service not found" });
			}

			res.json(
				service.toObject({
					versionKey: false,
					transform: (doc, ret) => {
						delete ret.OTP;
					},
				})
			);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async addExtraWorks(req, res) {
		const { extraWorks } = req.body;
		const service = await ServiceRequest.findById(req.params.id);

		if (!service) {
			return res.status(404).json({ message: "Service not found" });
		}

		if (!service.workStarted) {
			return res.status(400).json({ message: "Service not started yet" });
		}

		if (service.status !== "ASSIGNED") {
			return res.status(400).json({ message: "Extra work cannot be assigned" });
		}

		service.addedWorks = extraWorks;
		service.status = "REQUESTED";
		await service.save();

		res.json({ message: "Extra works added" });
	},

	async startService(req, res) {
		const service = await ServiceRequest.findById(req.params.id);

		if (!service) {
			return res.status(404).json({ message: "Service not found" });
		}

		const isActiveService = await ServiceRequest.findOne({
			rider: req.rider._id,
			workStarted: true,
		});

		if (isActiveService) {
			return res
				.status(400)
				.json({ message: "You have already started a service" });
		}

		console.log(service);
		if (service.status !== "ASSIGNED") {
			return res.status(400).json({ message: "Service cannot be started" });
		}

		service.workStarted = true;

		const rider = await Rider.findById(req.rider._id);
		rider.status = "BUSY";

		const today = new Date().toISOString().split("T")[0];
		const workingHoursEntry = rider.attendance.workingHours.find(
			(entry) => entry.date.toISOString().split("T")[0] === today
		);

		if (workingHoursEntry) {
			workingHoursEntry.durations.push({ start: new Date(), end: null });
		} else {
			rider.attendance.workingHours.push({
				date: new Date(),
				hours: 0,
				durations: [{ start: new Date(), end: null }],
			});
		}

		await rider.save();
		await service.save();

		res.status(200).json({ message: "Service Stated successfully" });
	},
	async verifyBankDetails(req, res) {
		const {
			beneficiaryAccount,
			beneficiaryIFSC,
			beneficiaryMobile,
			beneficiaryName,
		} = req.body;

		const options = {
			method: "POST",
			headers: {
				clientId: process.env.INVINCIBLE_CLIENT_ID,
				secretKey: process.env.INVINCIBLE_SECRET_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				beneficiaryAccount,
				beneficiaryIFSC,
				beneficiaryMobile,
				beneficiaryName,
			}),
		};

		try {
			const response = await fetch(
				"https://api.invincibleocean.com/invincible/bankAccount/verify",
				options
			);
			const data = await response.json();

			if (response.ok) {
				res.json({ message: "Bank details verified successfully", data });
			} else {
				res
					.status(response.status)
					.json({ message: "Bank details verification failed", data });
			}
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},
	async verifyCourtCase(req, res) {
		const { name, fatherName, address, dob, panNumber } = req.body;

		const options = {
			method: "POST",
			headers: {
				clientId: process.env.INVINCIBLE_CLIENT_ID,
				secretKey: process.env.INVINCIBLE_SECRET_KEY,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				fatherName,
				address,
				dob,
				panNumber,
			}),
		};

		try {
			const response = await fetch(
				"https://api.invincibleocean.com/invincible/courtCase/V2",
				options
			);
			const data = await response.json();

			if (response.ok) {
				res.json({ message: "Court case verified successfully", data });
			} else {
				res
					.status(response.status)
					.json({ message: "Court case verification failed", data });
			}
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},
	async markAttendance(req, res) {
		try {
			const { date, type, reason } = req.body;
			const rider = await Rider.findById(req.rider._id);

			if (!rider) {
				return res.status(404).json({ message: "Rider not found" });
			}

			if (type === "present") {
				rider.attendance.present.push({ date });
			} else if (type === "leave") {
				rider.attendance.leaves.push({ date, reason });
			} else {
				return res.status(400).json({ message: "Invalid attendance type" });
			}

			await rider.save();
			res.json({ message: "Attendance marked successfully" });
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async getAttendance(req, res) {
		try {
			const rider = await Rider.findById(req.rider._id).select("attendance");
			res.json(rider.attendance);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async addFaults(req, res) {
		const { faultType, faultImages, faultNotes } = req.body;
		const service = await ServiceRequest.findById(req.params.id);

		console.log(req.body);

		if (!service) {
			return res.status(404).json({ message: "Service not found" });
		}

		if (!service.workStarted) {
			return res.status(400).json({ message: "Service not started yet" });
		}

		console.log(
			service.status === "ASSIGNED",
			service.status === "IN_PROGRESS"
		);

		if (service.status !== "ASSIGNED" && service.status !== "IN_PROGRESS") {
			return res.status(400).json({ message: "Faults cannot be assigned" });
		}

		service.faults = {
			type: faultType,
			images: ["some", "img"],
			note: faultNotes,
		};
		await service.save();

		res.json({ message: "Faults added" });
	},

	async addRepairDetails(req, res) {
		const { faultNote, faultImages } = req.body;
		const service = await ServiceRequest.findById(req.params.id);

		if (!service) {
			return res.status(404).json({ message: "Service not found" });
		}

		if (!service.workStarted) {
			return res.status(400).json({ message: "Service not started yet" });
		}

		if (service.status !== "IN_PROGRESS") {
			return res
				.status(400)
				.json({ message: "Repair details cannot be added" });
		}

		service.repairDetails = {
			description: faultNote,
			rectifiedImages: ["some", "img"],
		};
		await service.save();

		res.json({ message: "Repair details added" });
	},

	async sendOTP(req, res) {
		try {
			const service = await ServiceRequest.findById(req.params.id);

			if (!service) {
				return res.status(404).json({ message: "Service not found" });
			}

			if (service.status !== "IN_PROGRESS") {
				return res.status(400).json({ message: "OTP cannot be sent" });
			}

			const OTP = Math.floor(100000 + Math.random() * 900000);
			console.log(OTP);
			service.OTP = OTP;
			await service.save();

			res.json({ message: "OTP sent successfully" });
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async verifyOTP(req, res) {
		try {
			const { OTP } = req.body;
			console.log(OTP);

			const service = await ServiceRequest.findById(req.params.id);

			if (!service) {
				return res.status(404).json({ message: "Service not found" });
			}

			if (service.status !== "IN_PROGRESS") {
				return res.status(400).json({ message: "OTP cannot be verified" });
			}

			console.log(service.OTP);
			if (service.OTP != OTP) {
				return res.status(400).json({ message: "Invalid OTP" });
			}

			const rider = await Rider.findById(req.rider._id);
			const today = new Date().toISOString().split("T")[0];
			const isTodayMarked = rider.attendance.present.some(
				(attendance) => attendance.date.toISOString().split("T")[0] === today
			);

			const session = await Rider.startSession();
			session.startTransaction();
			try {
				service.status = "COMPLETED";
				service.workStarted = false;
				rider.services.completed += 1;

				if (!isTodayMarked) {
					rider.attendance.present.push({ date: new Date() });
				}
				rider.earning = [
					...rider.earning,
					{ date: new Date(), amount: service.price },
				];
				rider.balance -= 50; // 5 coins deducted (This is in rupees)

				//update working hours
				const workingHoursEntry = rider.attendance.workingHours.find(
					(entry) => entry.date.toISOString().split("T")[0] === today
				);
				const lastEntry = workingHoursEntry.durations.pop();
				lastEntry.end = new Date();
				workingHoursEntry.durations.push(lastEntry);
				const diff = lastEntry.end - lastEntry.start;
				workingHoursEntry.hours += diff / 1000 / 60 / 60;
				service.completedAt = new Date();
				await service.save({ session });
				await rider.save({ session });

				await session.commitTransaction();
				session.endSession();
			} catch (error) {
				await session.abortTransaction();
				session.endSession();
				throw error;
			}

			res.json({ message: "OTP verified and work completed successfully" });
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},
};

export default riderController;
