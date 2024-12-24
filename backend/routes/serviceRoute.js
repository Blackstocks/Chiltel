// routes/serviceRoutes.js
import express from 'express';
import {
  getAllServices,
  getServiceById,
  addService,
  updateService,
  deleteService
} from '../controllers/serviceController.js';
import adminAuth from '../middleware/adminAuth.js'; // Assuming you have auth middleware

const router = express.Router();

// Public routes
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Protected routes (require authentication)
router.post('/', adminAuth, addService);
router.put('/update/:id', adminAuth, updateService);
router.delete('/delete/:id', adminAuth, deleteService);

export default router;