// controllers/sellerController.js
import Seller from "../models/seller.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";
import SellerProduct from "../models/sellerProduct.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, storeName, phoneNumber } = req.body;

    const existingSeller = await Seller.findOne({ email });
    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const seller = new Seller({
      name,
      email,
      password,
      storeName,
      phoneNumber,
      verificationToken,
    });

    await seller.save();

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        storeName: seller.storeName,
        phoneNumber: seller.phoneNumber,
        status: seller.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const seller = await Seller.findOne({ email });
    if (!seller) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (seller.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Your account is pending approval",
      });
    }

    const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      success: true,
      message: "Login successful",
      token,
      seller: {
        id: seller._id,
        name: seller.name,
        email: seller.email,
        storeName: seller.storeName,
        phoneNumber: seller.phoneNumber,
        status: seller.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
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

    seller.status = "approved";
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

    seller.status = "rejected";
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
    const { name, storeName, phoneNumber } = req.body;

    const seller = await Seller.findByIdAndUpdate(
      req.seller.id,
      { name, storeName, phoneNumber },
      { new: true }
    ).select("-password");

    res.json({
      success: true,
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
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
