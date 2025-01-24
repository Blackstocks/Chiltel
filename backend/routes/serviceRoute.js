// routes/serviceRoutes.js
import express from 'express';
import {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import { protect, authorize } from '../middleware/adminAuthMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Protected routes (require authentication)
router.post('/', protect, authorize(['super-admin', 'sub-admin']), addService);
router.put('/update/:id', protect, authorize(['super-admin', 'sub-admin']), updateService);
router.delete('/delete/:id', protect, authorize(['super-admin', 'sub-admin']), deleteService);

export default router;