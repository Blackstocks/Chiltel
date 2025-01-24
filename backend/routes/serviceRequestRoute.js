// routes/serviceRequestRoutes.js
import express from 'express';
import { serviceRequestController } from '../controllers/serviceRequestController.js';
import { protect, authorize } from '../middleware/adminAuthMiddleware.js';

const serviceRequestRoutes = express.Router();

// Public routes
serviceRequestRoutes.get('/:id', serviceRequestController.getServiceRequestById);

// Protected routes (require authentication)
serviceRequestRoutes.get('/user/:userId', serviceRequestController.getUserServiceRequests);
serviceRequestRoutes.post('/', serviceRequestController.createServiceRequest);
serviceRequestRoutes.put('/:id', serviceRequestController.updateServiceRequest);
serviceRequestRoutes.delete('/:id', serviceRequestController.cancelServiceRequest);

// Admin only routes
serviceRequestRoutes.get('/',protect, authorize(['super-admin', 'sub-admin']), serviceRequestController.getAllServiceRequests);
serviceRequestRoutes.post('/:id/assign-rider',protect, authorize(['super-admin', 'sub-admin']), serviceRequestController.assignRider);
serviceRequestRoutes.put('/:id/payment',protect, authorize(['super-admin', 'sub-admin']), serviceRequestController.updatePaymentStatus);

export default serviceRequestRoutes;