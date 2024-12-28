// src/controllers/rider.controller.js
import Rider from "../models/riderModel.js";
import ServiceRequest from "../models/serviceRequestModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const riderController = {
	// Auth Controllers
	async signup(req, res) {
		try {
			const {
				email,
				password,
				firstName,
				lastName,
				phoneNumber,
				specializations,
			} = req.body;
			console.log(specializations);

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
				phoneNumber,
				specializations,
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

	async login(req, res) {
		try {
			const { email, password } = req.body;

			// Check rider exists
			const rider = await Rider.findOne({ email });
			if (!rider) {
				return res.status(400).json({ message: "Invalid credentials" });
			}

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

			await Rider.findByIdAndUpdate(req.rider._id, {
				location: {
					type: "Point",
					coordinates: [longitude, latitude],
				},
			});

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
				.populate("user", "firstName lastName");

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
				.populate("service", "name rateChart");

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
				.populate("user", "name phoneNumber address");
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
				.skip((page - 1) * limit);

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

			service.rider = req.rider._id;
			service.requestedRiders = [];
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

	async completeService(req, res) {
		try {
			const service = await ServiceRequest.findById(req.params.id);

			if (!service) {
				return res.status(404).json({ message: "Service not found" });
			}

			if (service.status !== "IN_PROGRESS") {
				return res.status(400).json({ message: "Service cannot be completed" });
			}

			service.status = "COMPLETED";
			service.workStarted = false;
			service.completedAt = new Date();
			await service.save();

			res.json(service);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async updateServiceStatus(req, res) {
		try {
			const { status } = req.body;
			const service = await ServiceRequest.findOneAndUpdate(
				{ _id: req.params.id, rider: req.rider._id },
				{ status },
				{ new: true }
			);

			if (!service) {
				return res.status(404).json({ message: "Service not found" });
			}

			res.json(service);
		} catch (error) {
			res.status(500).json({ message: "Server error", error: error.message });
		}
	},

	async addExtraWorks(req, res) {
		const { extraWorks } = req.body;
		console.log(extraWorks);
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

		await service.save();

		res.status(200).json({ message: "Service Stated successfully" });
	},

	async startWorking(req, res) {},
};

export default riderController;
