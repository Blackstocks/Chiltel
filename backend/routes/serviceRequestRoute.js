// routes/serviceRequestRoutes.js
import express from 'express';
import { serviceRequestController } from '../controllers/serviceRequestController.js';
import adminAuth from '../middleware/adminAuth.js';

const serviceRequestRoutes = express.Router();

// Public routes
serviceRequestRoutes.get('/:id', serviceRequestController.getServiceRequestById);

// Protected routes (require authentication)
serviceRequestRoutes.post('/', serviceRequestController.createServiceRequest);
serviceRequestRoutes.put('/:id', serviceRequestController.updateServiceRequest);
serviceRequestRoutes.delete('/:id', serviceRequestController.cancelServiceRequest);

// Admin only routes
serviceRequestRoutes.get('/',adminAuth, serviceRequestController.getAllServiceRequests);
serviceRequestRoutes.post('/:id/assign-rider',adminAuth, serviceRequestController.assignRider);
serviceRequestRoutes.put('/:id/payment',adminAuth, serviceRequestController.updatePaymentStatus);

export default serviceRequestRoutes;