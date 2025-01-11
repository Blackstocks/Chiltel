// controllers/sellerController.js
import Seller from "../models/seller.js";
import Order from "../models/orderModel.js";
import Product from '../models/productModel.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validateProduct } from '../utils/validateSellerProduct.js';
import bucket from "../config/firebaseConfig.js";
import fs from "fs";




export const register = async (req, res) => {
  try {
    const {
      email,
      password,
      shopName,
      proprietorName,
      aadharNumber,
      phoneNumber,
      registeredAddress,
      warehouseAddress,
      agreementAccepted
    } = req.body;

    // Check if seller with same email exists
    const existingEmailSeller = await Seller.findOne({ email });
    if (existingEmailSeller) {
      return res.status(400).json({
        success: false,
        message: 'A seller with this email already exists'
      });
    }

    // Check if seller with same Aadhar number exists
    const existingAadharSeller = await Seller.findOne({ aadharNumber });
    if (existingAadharSeller) {
      return res.status(400).json({
        success: false,
        message: 'A seller with this Aadhar number already exists'
      });
    }

    // Create new seller
    const seller = await Seller.create({
      email,
      password,
      shopName,
      proprietorName,
      aadharNumber,
      phoneNumber,
      registeredAddress,
      warehouseAddress,
      agreementAccepted,
      registrationStatus: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. Pending admin approval.',
      data: {
        id: seller._id,
        email: seller.email,
        shopName: seller.shopName,
        registrationStatus: seller.registrationStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find seller and explicitly select password field (since it's deselected in schema)
    const seller = await Seller.findOne({ email }).select('+password');
    if (!seller) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    // Check registration status
    if (seller.registrationStatus !== "approved") {
      return res.status(403).json({
        success: false,
        message: 
          seller.registrationStatus === "pending"
            ? "Your account is pending approval"
            : seller.registrationStatus === "rejected"
            ? "Your account registration was rejected"
            : "Your account is not active"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: seller._id,
        email: seller.email
      }, 
      process.env.JWT_SECRET, 
      {
        expiresIn: "30d"
      }
    );

    // Send response
    res.json({
      success: true,
      message: "Login successful",
      token,
      seller,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again later."
    });
  }
};

// controllers/adminController.js
export const approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.registrationStatus = "approved";
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller approved successfully",
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error approving seller",
      error: error.message,
    });
  }
};

export const rejectSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.registrationStatus = "rejected";
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller rejected successfully",
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rejecting seller",
      error: error.message,
    });
  }
};

export const getSellers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;

    // Build query
    const query = {};

    // Search functionality
    if (search) {
      query.$or = [
        { email: { $regex: search, $options: "i" } },
        { shopName: { $regex: search, $options: "i" } },
        { proprietorName: { $regex: search, $options: "i" } },
      ];
    }

    // Status filter
    if (status && status !== "all") {
      query.registrationStatus = status;
    }

    const sellers = await Seller.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Seller.countDocuments(query);

    res.json({
      success: true,
      data: sellers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch sellers",
      error: error.message,
    });
  }
};

export const verifyToken = async (req, res) => {
  try {
    // Find seller by ID from req.seller (set by auth middleware) and exclude password
    const seller = await Seller.findById(req.seller._id).select("-password");
    
    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    res.json({
      success: true,
      seller
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Token verification failed",
      error: error.message
    });
  }
};


// controllers/sellerController.js

export const getProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.seller.id).select("-password");
    res.json({
      success: true,
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      // Basic Details
      shopName,
      proprietorName,
      phoneNumber,
      
      // Addresses
      registeredAddress,
      warehouseAddress,
      
      // Optional Details
      gstNumber,
      bankDetails,
    } = req.body;

    // Create update object
    const updateData = {};

    // Update basic details if provided
    if (shopName) updateData.shopName = shopName;
    if (proprietorName) updateData.proprietorName = proprietorName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (gstNumber) updateData.gstNumber = gstNumber;

    // Handle registered address update
    if (registeredAddress) {
      updateData.registeredAddress = {
        ...req.seller.registeredAddress?.toObject(),
        ...registeredAddress
      };
    }

    // Handle warehouse address update
    if (warehouseAddress) {
      updateData.warehouseAddress = {
        ...req.seller.warehouseAddress?.toObject(),
        ...warehouseAddress
      };
    }

    // Handle bank details update
    if (bankDetails) {
      updateData.bankDetails = {
        ...req.seller.bankDetails?.toObject(),
        ...bankDetails
      };
    }

    // Update timestamp
    updateData.lastUpdated = new Date();

    // Check for unique GST if being updated
    if (gstNumber) {
      const existingGST = await Seller.findOne({ 
        gstNumber, 
        _id: { $ne: req.seller.id } 
      });
      
      if (existingGST) {
        return res.status(400).json({
          success: false,
          message: "GST number already registered with another seller"
        });
      }
    }

    // Check for unique bank account if being updated
    if (bankDetails?.accountNumber) {
      const existingAccount = await Seller.findOne({ 
        'bankDetails.accountNumber': bankDetails.accountNumber,
        _id: { $ne: req.seller.id }
      });
      
      if (existingAccount) {
        return res.status(400).json({
          success: false,
          message: "Bank account number already registered with another seller"
        });
      }
    }

    const updatedSeller = await Seller.findByIdAndUpdate(
      req.seller.id,
      updateData,
      { 
        new: true,
        runValidators: true 
      }
    ).select('-password');

    if (!updatedSeller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found"
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedSeller._id,
        shopName: updatedSeller.shopName,
        proprietorName: updatedSeller.proprietorName,
        phoneNumber: updatedSeller.phoneNumber,
        registeredAddress: updatedSeller.registeredAddress,
        warehouseAddress: updatedSeller.warehouseAddress,
        gstNumber: updatedSeller.gstNumber,
        bankDetails: updatedSeller.bankDetails,
        lastUpdated: updatedSeller.lastUpdated
      }
    });

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update profile. Please try again."
    });
  }
};

export const uploadDocument = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log("File received:", file);

        // Define the destination in Firebase Storage
        const firebaseFileName = `uploads/${file.originalname}`;

        // Upload file to Firebase Storage
        await bucket.upload(file.path, {
            destination: firebaseFileName,
            metadata: {
                contentType: file.mimetype,
            },
        });

        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${firebaseFileName}`;

        // Cleanup temporary file
        fs.unlinkSync(file.path);

        console.log("File uploaded to Firebase:", publicUrl);

        res.status(200).json({ message: "File uploaded successfully", url: publicUrl });
    } catch (error) {
        console.error("Error uploading file:", error);
        res.status(500).json({ message: "Failed to upload document", error: error.message });
    }
};


// controllers/productController.js

export const addProduct = async (req, res) => {
  try {
    const sellerId = req.seller.id; // Assuming we set this in auth middleware
    
    // Combine request body with seller information
    const productData = {
      ...req.body,
      seller: sellerId,
      requestedStatus: 'pending'
    };

    // Validate the product data
    const validationError = validateProduct(productData);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationError
      });
    }

    // Create new product
    const product = new Product(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product submitted successfully',
      data: product
    });

  } catch (error) {
    console.error('Error in addProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting product',
      error: error.message
    });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const sellerId = req.seller.id;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search and filter parameters
    const {
      search,
      mainCategory,
      type,
      category,
      requestedStatus,
      minPrice,
      maxPrice,
      inStock,
      sortBy,
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { seller: sellerId };

    // Search functionality (search in name, brand, model)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filters
    if (mainCategory) query.mainCategory = mainCategory;
    if (type) query.type = type;
    if (category) query.category = category;
    if (requestedStatus) query.requestedStatus = requestedStatus;

    // Price range filter
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = parseFloat(minPrice);
      if (maxPrice !== undefined) query.price.$lte = parseFloat(maxPrice);
    }

    // Stock filter
    if (inStock === 'true') {
      query.inStock = { $gt: 0 };
    } else if (inStock === 'false') {
      query.inStock = 0;
    }

    // Sorting
    let sortOptions = { createdAt: -1 }; // default sort
    if (sortBy) {
      sortOptions = {
        [sortBy]: sortOrder === 'asc' ? 1 : -1
      };
    }

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Get unique values for filters
    const aggregateFilters = await Product.aggregate([
      { $match: { seller: sellerId } },
      {
        $group: {
          _id: null,
          mainCategories: { $addToSet: '$mainCategory' },
          types: { $addToSet: '$type' },
          categories: { $addToSet: '$category' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    const filters = aggregateFilters[0] || {};

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          hasNextPage,
          hasPrevPage,
          limit
        },
        filters: {
          mainCategories: filters.mainCategories || [],
          types: filters.types || [],
          categories: filters.categories || [],
          priceRange: {
            min: filters.minPrice || 0,
            max: filters.maxPrice || 0
          }
        }
      }
    });

  } catch (error) {
    console.error('Error in getSellerProducts:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.seller.id;

    // Find products by seller
    const products = await Product.find({ seller: sellerId }).select('_id');
    const productIds = products.map(product => product._id);

    // Find orders containing these products
    const orders = await Order.find({ 'products.product': { $in: productIds } });
    // Populate userId in orders
    await Order.populate(orders, {
      path: 'userId',
      select: 'name email'
    });
    // Populate products.product with name
    await Order.populate(orders, {
      path: 'products.product',
      select: 'name'
    });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error in getSellerOrders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller.id;

    const product = await Product.findOne({
      _id: productId,
      seller: sellerId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if product can be deleted (e.g., not already approved)
    if (product.requestedStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete approved product'
      });
    }

    await Product.deleteOne({ _id: productId });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller.id;
    const updateData = req.body;

    // Find the product and ensure it belongs to the seller
    const product = await Product.findOne({
      _id: productId,
      seller: sellerId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found or you do not have permission to edit it'
      });
    }

    // Check if product is already approved
    if (product.requestedStatus === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'Cannot edit approved product. Please contact admin for changes.'
      });
    }

    // Remove fields that shouldn't be updated
    delete updateData.seller;
    delete updateData.requestedStatus;
    delete updateData.rating;
    delete updateData.reviews;
    delete updateData.createdAt;

    // Validate the updated data
    const validationError = validateProduct({
      ...product.toObject(),
      ...updateData
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationError
      });
    }

    // If changing price or discount, validate the values
    if (updateData.price && updateData.price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    if (updateData.discount && (updateData.discount < 0 || updateData.discount > 1)) {
      return res.status(400).json({
        success: false,
        message: 'Discount must be between 0 and 1'
      });
    }

    // Handle specifications update
    if (updateData.specifications) {
      if (typeof updateData.specifications !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Specifications must be an object'
        });
      }
    }

    // Handle arrays (features, imageUrls)
    if (updateData.features && !Array.isArray(updateData.features)) {
      return res.status(400).json({
        success: false,
        message: 'Features must be an array'
      });
    }

    if (updateData.imageUrls && !Array.isArray(updateData.imageUrls)) {
      return res.status(400).json({
        success: false,
        message: 'Image URLs must be an array'
      });
    }

    // Update the product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { 
        $set: updateData,
        requestedStatus: 'pending' // Reset to pending since product was modified
      },
      { 
        new: true, // Return the updated document
        runValidators: true // Run model validations
      }
    );

    res.status(200).json({
      success: true,
      message: 'Product updated successfully. Waiting for admin approval.',
      data: updatedProduct
    });

  } catch (error) {
    console.error('Error in editProduct:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};
