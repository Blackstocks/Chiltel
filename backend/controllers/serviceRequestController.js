// controllers/serviceRequestController.js
import ServiceRequest from "../models/serviceRequestModel.js";
import mongoose from "mongoose";

export const serviceRequestController = {
  // Create a new service request
  createServiceRequest: async (req, res) => {
    try {
      console.log(req.body);
      const { user, service, userLocation, scheduledFor, price, remarks } =
        req.body;

      const serviceRequest = new ServiceRequest({
        user,
        service,
        userLocation,
        scheduledFor: new Date(scheduledFor),
        price,
        remarks,
      });

      await serviceRequest.save();

      res.status(201).json({
        success: true,
        message: "Service request created successfully",
        data: serviceRequest,
      });
    } catch (error) {
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
        .populate("service", "name description price estimatedDuration")
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

  getUserServiceRequests: async (req, res) => {
    try {
      const userId = req.params;
      const serviceRequests = await ServiceRequest.find({
        user: new mongoose.Types.ObjectId(userId.userId),
      })
        .populate("user", "name email phone")
        .populate("service", "name description price estimatedDuration")
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
        .populate("service")
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
        .populate("service", "name description price")
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

      // If status is being updated to COMPLETED, set completedAt
      if (updateData.status === "COMPLETED") {
        updateData.completedAt = new Date();
      }

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
