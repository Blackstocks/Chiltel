// controllers/serviceController.js
import Service from "../models/serviceModel.js";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const ACRateChart = require("../data/AC_Rate_Charge.json");

// Get all services
const getAllServices = async (req, res) => {
	try {
		const services = await Service.find();
		res.status(200).json({
			success: true,
			message: "Services fetched successfully",
			data: services,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching services",
			error: error.message,
		});
	}
};

// Get single service
const getServiceById = async (req, res) => {
	try {
		const service = await Service.findById(req.params.id);
		if (!service) {
			return res.status(404).json({
				success: false,
				message: "Service not found",
			});
		}
		res.status(200).json({
			success: true,
			message: "Service fetched successfully",
			data: service,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error fetching service",
			error: error.message,
		});
	}
};

// Add new service
const addService = async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			discount,
			product,
			category,
			estimatedDuration,
			isAvailable,
			requirements,
		} = req.body;

		// Validate required fields
		if (!name || !description || !price || !product || !category) {
			return res.status(400).json({
				success: false,
				message: "Please provide all required fields",
			});
		}

		// Validate category enum
		const validCategories = ["Installation", "Service", "Repair"];
		if (!validCategories.includes(category)) {
			return res.status(400).json({
				success: false,
				message: "Invalid category",
			});
		}

		const service = new Service({
			name,
			description,
			price,
			discount: discount || 0,
			product,
			rateChart: product === "Air Conditioner" ? ACRateChart : {},
			category,
			estimatedDuration,
			isAvailable: isAvailable ?? true,
			requirements: requirements || [],
		});

		await service.save();

		res.status(201).json({
			success: true,
			message: "Service added successfully",
			data: service,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error adding service",
			error: error.message,
		});
	}
};

// Update service
const updateService = async (req, res) => {
	try {
		const {
			name,
			description,
			price,
			discount,
			product,
			category,
			estimatedDuration,
			isAvailable,
			requirements,
		} = req.body;

		const service = await Service.findByIdAndUpdate(
			req.params.id,
			{
				name,
				description,
				price,
				discount,
				product,
				rateChart: product === "Air Conditioner" ? ACRateChart : {},
				category,
				estimatedDuration,
				isAvailable,
				requirements,
				updatedAt: Date.now(),
			},
			{ new: true }
		);

		if (!service) {
			return res.status(404).json({
				success: false,
				message: "Service not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Service updated successfully",
			data: service,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error updating service",
			error: error.message,
		});
	}
};

// Delete service
const deleteService = async (req, res) => {
	try {
		const service = await Service.findByIdAndDelete(req.params.id);
		if (!service) {
			return res.status(404).json({
				success: false,
				message: "Service not found",
			});
		}
		res.status(200).json({
			success: true,
			message: "Service deleted successfully",
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Error deleting service",
			error: error.message,
		});
	}
};

export {
	getAllServices,
	getServiceById,
	addService,
	updateService,
	deleteService,
};
