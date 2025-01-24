import express from 'express';
import { register, login } from '../controllers/adminAuthController.js';
import { protect, authorize } from '../middleware/adminAuthMiddleware.js';
import { getSubAdmins, getSubAdmin, deleteSubAdmin, updateProfile } from '../controllers/adminAuthController.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);


router.get('/sub-admins', protect, authorize(['super-admin']), getSubAdmins);
router.post('/sub-admin/register', protect, authorize(['super-admin']), register);
router.get('/sub-admin/:id', protect, authorize(['super-admin']), getSubAdmin);
router.delete('/sub-admin/:id', protect, authorize(['super-admin']), deleteSubAdmin);

router.put('/profile', protect, authorize(['super-admin', 'sub-admin']), updateProfile);

// Protected routes
router.get(
  '/admin-data',
  protect,
  authorize(['super-admin']),
  (req, res) => {
    res.json({ message: 'Super-admin data access granted' });
  }
);

router.get(
  '/sub-admin-data',
  protect,
  authorize(['super-admin', 'sub-admin']),
  (req, res) => {
    res.json({ message: 'Sub-admin data access granted' });
  }
);

export default router;
