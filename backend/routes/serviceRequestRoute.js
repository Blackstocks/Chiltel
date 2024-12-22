// routes/serviceRequestRoutes.js
import express from 'express';
import { serviceRequestController } from '../controllers/serviceRequestController.js';
import adminAuth from '../middleware/adminAuth.js';

const serviceRequestRoutes = express.Router();

// Public routes
serviceRequestRoutes.get('/service-requests/:id', serviceRequestController.getServiceRequestById);

// Protected routes (require authentication)
serviceRequestRoutes.get('/user/:userId', serviceRequestController.getUserServiceRequests);
serviceRequestRoutes.post('/service-requests', serviceRequestController.createServiceRequest);
serviceRequestRoutes.put('/service-requests/:id', serviceRequestController.updateServiceRequest);
serviceRequestRoutes.delete('/service-requests/:id', serviceRequestController.cancelServiceRequest);

// Admin only routes
serviceRequestRoutes.get('/service-requests',adminAuth, serviceRequestController.getAllServiceRequests);
serviceRequestRoutes.post('/service-requests/:id/assign-rider',adminAuth, serviceRequestController.assignRider);
serviceRequestRoutes.put('/service-requests/:id/payment',adminAuth, serviceRequestController.updatePaymentStatus);

export default serviceRequestRoutes;