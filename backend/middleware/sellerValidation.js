import { check, validationResult } from 'express-validator';

export const validateSellerRegistration = [
  // Authentication Details
  check('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  check('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  // Basic Details
  check('shopName')
    .trim()
    .notEmpty()
    .withMessage('Shop name is required'),
  
  check('proprietorName')
    .trim()
    .notEmpty()
    .withMessage('Proprietor name is required'),
  
  check('aadharNumber')
    .matches(/^\d{12}$/)
    .withMessage('Aadhar number must be 12 digits'),
  
  check('phoneNumber')
    .matches(/^\d{10}$/)
    .withMessage('Phone number must be 10 digits'),

  // Registered Address
  check('registeredAddress.street')
    .notEmpty()
    .withMessage('Street address is required'),
  
  check('registeredAddress.city')
    .notEmpty()
    .withMessage('City is required'),
  
  check('registeredAddress.state')
    .notEmpty()
    .withMessage('State is required'),
  
  check('registeredAddress.pincode')
    .matches(/^\d{6}$/)
    .withMessage('Pincode must be 6 digits'),

  // Warehouse Address
  check('warehouseAddress.street')
    .notEmpty()
    .withMessage('Warehouse street address is required'),
  
  check('warehouseAddress.city')
    .notEmpty()
    .withMessage('Warehouse city is required'),
  
  check('warehouseAddress.state')
    .notEmpty()
    .withMessage('Warehouse state is required'),
  
  check('warehouseAddress.pincode')
    .matches(/^\d{6}$/)
    .withMessage('Warehouse pincode must be 6 digits'),

  // Agreement
  check('agreementAccepted')
    .isBoolean()
    .equals('true')
    .withMessage('Must accept the agreement'),

  // Validation middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }
    next();
  }
];