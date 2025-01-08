import Product from "../models/productModel.js"; // Path to your Product model

// Add Product Controller
const addProduct = async (req, res) => {
  try {
    // Destructure product details from request body
    const {
      name,
      brand,
      model,
      mainCategory,
      type,
      category,
      price,
      discount,
      rating,
      reviews,
      features,
      specifications,
      inStock,
      thumbnail,
      imageUrls,
    } = req.body;

    // Input Validation
    if (!name || !brand || !model || !category || !price || !thumbnail) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, brand, model, category, price, and thumbnail.",
      });
    }

    // Validate enum fields
    const validMainCategories = ["Retail", "Domestic Appliance", "Kitchen"];
    const validTypes = [
      "water",
      "cooling",
      "heating",
      "cooking",
      "cleaning",
      "display",
    ];

    if (mainCategory && !validMainCategories.includes(mainCategory)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid main category. Must be one of: Retail, Domestic Appliance, Kitchen",
      });
    }

    if (type && !validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid type. Must be one of: water, cooling, heating, cooking, cleaning, display",
      });
    }

    // Validate numeric fields
    if (discount && (discount < 0 || discount > 1)) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 1",
      });
    }

    if (rating && (rating < 0 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    // Create a new product instance
    const newProduct = new Product({
      name,
      brand,
      model,
      mainCategory,
      type,
      category,
      price,
      discount: discount || 0,
      rating: rating || 0,
      reviews: reviews || 0,
      features: features || [],
      specifications: specifications || {},
      inStock: inStock || 0,
      thumbnail,
      imageUrls: imageUrls || [],
      createdAt: new Date(),
    });

    // Save product to the database
    await newProduct.save();

    // Send success response
    console.log("Product added successfully!");
    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      // data: newProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Send error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not add product.",
      error: error.message,
    });
  }
};

// Remove Product Controller
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product ID is provided
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required." });
    }

    // Find and delete the product by ID
    const deletedProduct = await Product.findByIdAndDelete(id);

    // Check if product was found and deleted
    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Product removed successfully!",
      data: deletedProduct,
    });
  } catch (error) {
    console.error("Error removing product:", error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not remove product.",
      error: error.message,
    });
  }
};

// Update Product Controller
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if product ID is provided
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required." });
    }

    // Validate enum fields if they are being updated
    const validMainCategories = ["Retail", "Domestic Appliance", "Kitchen"];
    const validTypes = [
      "water",
      "cooling",
      "heating",
      "cooking",
      "cleaning",
      "display",
    ];

    if (
      updateData.mainCategory &&
      !validMainCategories.includes(updateData.mainCategory)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid main category. Must be one of: Retail, Domestic Appliance, Kitchen",
      });
    }

    if (updateData.type && !validTypes.includes(updateData.type)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid type. Must be one of: water, cooling, heating, cooking, cleaning, display",
      });
    }

    // Validate numeric fields if they are being updated
    if (
      updateData.discount &&
      (updateData.discount < 0 || updateData.discount > 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Discount must be between 0 and 1",
      });
    }

    if (updateData.rating && (updateData.rating < 0 || updateData.rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 0 and 5",
      });
    }

    // Find and update the product by ID
    const updatedProduct = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    // Check if product was found and updated
    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Product updated successfully!",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error.message);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    // Send error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not update product.",
      error: error.message,
    });
  }
};

// Get Single Product Controller
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product ID is provided
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required." });
    }

    // Find the product by ID
    const product = await Product.findById(id);

    // Check if product was found
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Product retrieved successfully!",
      data: product,
    });
  } catch (error) {
    console.error("Error retrieving product:", error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not retrieve product.",
      error: error.message,
    });
  }
};

// List Products Controller
const listProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();
    // Filter products by requestedStatus
    const filteredProducts = products.filter(
      (product) =>
        product.requestedStatus === "approved" ||
        product.requestedStatus === undefined
    );

    // Send success response
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully!",
      data: filteredProducts,
    });
  } catch (error) {
    console.error("Error retrieving products:", error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not retrieve products.",
      error: error.message,
    });
  }
};

// Get Pending Products Controller
const getPendingProducts = async (req, res) => {
  try {
    // Fetch all products with requestedStatus as "pending"
    const pendingProducts = await Product.find({ requestedStatus: "pending" })
      .sort({ createdAt: -1 })
      .populate({
        path: "seller",
        select: "-password", // Only select the fields you need
      });

    // Send success response
    res.status(200).json({
      success: true,
      message: "Pending products retrieved successfully!",
      data: pendingProducts,
    });
  } catch (error) {
    console.error("Error retrieving pending products:", error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not retrieve pending products.",
      error: error.message,
    });
  }
};

// Approve Product Controller
const approveProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product ID is provided
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required." });
    }

    // Find and update the product's requestedStatus to "approved"
    const approvedProduct = await Product.findByIdAndUpdate(
      id,
      { requestedStatus: "approved" },
      { new: true, runValidators: true }
    );

    // Check if product was found and updated
    if (!approvedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Product approved successfully!",
      data: approvedProduct,
    });
  } catch (error) {
    console.error("Error approving product:", error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not approve product.",
      error: error.message,
    });
  }
};

// Reject Product Controller
const rejectProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product ID is provided
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required." });
    }

    // Find and update the product's requestedStatus to "rejected"
    const rejectedProduct = await Product.findByIdAndUpdate(
      id,
      { requestedStatus: "rejected" },
      { new: true, runValidators: true }
    );

    // Check if product was found and updated
    if (!rejectedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: "Product rejected successfully!",
      data: rejectedProduct,
    });
  } catch (error) {
    console.error("Error rejecting product:", error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Could not reject product.",
      error: error.message,
    });
  }
};

export {
  addProduct,
  removeProduct,
  getProduct,
  listProducts,
  updateProduct,
  getPendingProducts,
  approveProduct,
  rejectProduct,
};
