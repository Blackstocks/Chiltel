// controllers/sellerController.js
import Seller from "../models/seller.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import SellerProduct from "../models/sellerProduct.js";

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
      seller: {
        id: seller._id,
        email: seller.email,
        shopName: seller.shopName,
        proprietorName: seller.proprietorName,
        phoneNumber: seller.phoneNumber,
        registrationStatus: seller.registrationStatus,
        registeredAddress: seller.registeredAddress,
        warehouseAddress: seller.warehouseAddress
      }
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

// controllers/productController.js
export const addProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      sellerId: req.seller.id,
      approvalStatus: "pending",
    };

    const product = new SellerProduct(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: "Product submitted for approval",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};

export const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      availability,
      priceRange,
    } = req.query;

    // Build query
    const query = { sellerId: req.seller.id };

    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }

    // Category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Availability filter
    if (availability && availability !== "all") {
      query.availability = availability === "inStock";
    }

    // Price range filter
    if (priceRange && priceRange !== "all") {
      if (priceRange === "30000+") {
        query.price = { $gte: 30000 };
      } else {
        const [min, max] = priceRange.split("-").map(Number);
        query.price = { $gte: min, $lte: max };
      }
    }

    const products = await SellerProduct.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SellerProduct.countDocuments(query);

    res.json({
      success: true,
      data: products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await SellerProduct.findOne({
      _id: id,
      sellerId: req.seller.id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.approvalStatus === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot edit approved products",
      });
    }

    const updatedProduct = await SellerProduct.findByIdAndUpdate(
      id,
      {
        ...req.body,
        approvalStatus: "pending",
        updatedAt: Date.now(),
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Product updated and submitted for approval",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await SellerProduct.findOneAndDelete({
      _id: id,
      sellerId: req.seller.id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await SellerProduct.findOne({
      _id: id,
      sellerId: req.seller.id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

export const getProductStats = async (req, res) => {
  try {
    const stats = await SellerProduct.aggregate([
      { $match: { sellerId: req.seller._id } },
      {
        $group: {
          _id: "$approvalStatus",
          count: { $sum: 1 },
          totalValue: { $sum: "$price" },
        },
      },
    ]);

    const formattedStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      totalValue: 0,
    };

    stats.forEach((stat) => {
      formattedStats[stat._id] = stat.count;
      formattedStats.total += stat.count;
      formattedStats.totalValue += stat.totalValue;
    });

    res.json({
      success: true,
      data: formattedStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product statistics",
      error: error.message,
    });
  }
};
