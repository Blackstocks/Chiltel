// middleware/auth.js
import jwt from 'jsonwebtoken';
import Seller from '../models/seller.js';

export const protectSeller = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const seller = await Seller.findById(decoded.id).select('-password');
    if (!seller) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    if (seller.registrationStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending approval'
      });
    }

    req.seller = seller;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Not authorized',
      error: error.message
    });
  }
};