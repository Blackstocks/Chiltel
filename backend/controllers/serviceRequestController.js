// controllers/serviceRequestController.js
import ServiceRequest from '../models/serviceRequestModel.js';
import { ApiError } from '../utils/ApiError';

export const serviceRequestController = {
  // Create a new service request
  createServiceRequest: async (req, res) => {
    try {
      const {
        user,
        service,
        userLocation,
        scheduledFor,
        price,
        remarks
      } = req.body;

      const serviceRequest = new ServiceRequest({
        user,
        service,
        userLocation,
        scheduledFor: new Date(scheduledFor),
        price,
        remarks
      });

      await serviceRequest.save();

      res.status(201).json({
        success: true,
        message: 'Service request created successfully',
        data: serviceRequest
      });
    } catch (error) {
      throw new ApiError(400, 'Failed to create service request', error);
    }
  },

  // Get all service requests
  getAllServiceRequests: async (req, res) => {
    try {
      const {
        status,
        paymentStatus,
        startDate,
        endDate,
        rider
      } = req.query;

      let query = {};

      // Add filters if provided
      if (status) query.status = status;
      if (paymentStatus) query.paymentStatus = paymentStatus;
      if (rider) query.rider = rider;
      
      // Date range filter
      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const serviceRequests = await ServiceRequest.find(query)
        .populate('user', 'name email phone')
        .populate('service', 'name description price')
        .populate('rider', 'name phone')
        .sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        count: serviceRequests.length,
        data: serviceRequests
      });
    } catch (error) {
      throw new ApiError(400, 'Failed to fetch service requests', error);
    }
  },

  // Get single service request by ID
  getServiceRequestById: async (req, res) => {
    try {
      const { id } = req.params;

      const serviceRequest = await ServiceRequest.findById(id)
        .populate('user', 'name email phone')
        .populate('service', 'name description price')
        .populate('rider', 'name phone');

      if (!serviceRequest) {
        throw new ApiError(404, 'Service request not found');
      }

      res.status(200).json({
        success: true,
        data: serviceRequest
      });
    } catch (error) {
      throw new ApiError(400, 'Failed to fetch service request', error);
    }
  },

  // Update service request
  updateServiceRequest: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // If status is being updated to COMPLETED, set completedAt
      if (updateData.status === 'COMPLETED') {
        updateData.completedAt = new Date();
      }

      const serviceRequest = await ServiceRequest.findByIdAndUpdate(
        id,
        { 
          ...updateData,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!serviceRequest) {
        throw new ApiError(404, 'Service request not found');
      }

      res.status(200).json({
        success: true,
        message: 'Service request updated successfully',
        data: serviceRequest
      });
    } catch (error) {
      throw new ApiError(400, 'Failed to update service request', error);
    }
  },

  // Assign rider to service request
  assignRider: async (req, res) => {
    try {
      const { id } = req.params;
      const { riderId } = req.body;

      const serviceRequest = await ServiceRequest.findByIdAndUpdate(
        id,
        {
          rider: riderId,
          status: 'ASSIGNED',
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!serviceRequest) {
        throw new ApiError(404, 'Service request not found');
      }

      res.status(200).json({
        success: true,
        message: 'Rider assigned successfully',
        data: serviceRequest
      });
    } catch (error) {
      throw new ApiError(400, 'Failed to assign rider', error);
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
            paidAt: new Date()
          },
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!serviceRequest) {
        throw new ApiError(404, 'Service request not found');
      }

      res.status(200).json({
        success: true,
        message: 'Payment status updated successfully',
        data: serviceRequest
      });
    } catch (error) {
      throw new ApiError(400, 'Failed to update payment status', error);
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
          status: 'CANCELLED',
          remarks: cancelReason,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!serviceRequest) {
        throw new ApiError(404, 'Service request not found');
      }

      res.status(200).json({
        success: true,
        message: 'Service request cancelled successfully',
        data: serviceRequest
      });
    } catch (error) {
      throw new ApiError(400, 'Failed to cancel service request', error);
    }
  }
};