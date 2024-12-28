// controllers/ridersController.js
import Rider from '../models/riderModel.js';

// Add new rider
const addRider = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      phoneNumber, 
      specialization,
      location 
    } = req.body;

    // Validate required fields
    if (!name || !email || !password || !phoneNumber || !specialization || !location) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: name, email, password, phoneNumber, specialization, and location'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate specialization enum
    const validSpecializations = ["AC", "Cooler", "Microwave"];
    if (!validSpecializations.includes(specialization)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid specialization. Must be one of: AC, Cooler, Microwave'
      });
    }

    // Validate location format
    if (!location.coordinates || 
        !Array.isArray(location.coordinates) || 
        location.coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: 'Location must include coordinates [longitude, latitude]'
      });
    }

    // Check if rider with email already exists
    const existingRider = await Rider.findOne({ email });
    if (existingRider) {
      return res.status(400).json({
        success: false,
        message: 'Rider with this email already exists'
      });
    }

    // Create new rider
    const rider = new Rider({
      name,
      email,
      password, // Note: You should hash this password before saving
      phoneNumber,
      specialization,
      status: "OFFLINE", // default status
      assignedServices: [], // initialize empty
      rating: {
        average: 0,
        count: 0
      },
      location: {
        type: "Point",
        coordinates: location.coordinates
      }
    });

    await rider.save();

    res.status(201).json({
      success: true,
      message: 'Rider added successfully',
      data: rider
    });
  } catch (error) {
    console.error('Error adding rider:', error);
    
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error adding rider',
      error: error.message
    });
  }
};

// Get all employees
const getAllRiders = async (req, res) => {
  try {
    const riders = await Rider.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: riders.length,
      data: riders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching riders',
      error: error.message
    });
  }
};

// Get single employee
const getRiderById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching employee',
      error: error.message
    });
  }
};

// Update employee
const updateRider = async (req, res) => {
  try {
    const { name, role, specialization, phone, email, joiningDate } = req.body;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if email exists for other employees
    const existingEmployee = await Employee.findOne({ 
      email, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Email already in use by another employee'
      });
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name,
        role,
        specialization,
        phone,
        email,
        joiningDate: new Date(joiningDate),
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee updated successfully',
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating employee',
      error: error.message
    });
  }
};

// Delete employee
const deleteRider = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Employee deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting employee',
      error: error.message
    });
  }
};

// Approve rider
const approveRider = async (req, res) => {
  try {
    const rider = await Rider.findById(req.params.id);

    if (!rider) {
      return res.status(404).json({
        success: false,
        message: 'Rider not found'
      });
    }

    rider.registrationStatus = 'APPROVED';
    await rider.save();

    res.status(200).json({
      success: true,
      message: 'Rider approved successfully',
      data: rider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error approving rider',
      error: error.message
    });
  }
};

export { addRider, getAllRiders, getRiderById, updateRider, deleteRider, approveRider };