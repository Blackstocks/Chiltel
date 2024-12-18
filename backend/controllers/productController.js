import Product from '../models/productModel.js'; // Path to your Product model

// Add Product Controller
const addProduct = async (req, res) => {
  try {
    // Destructure product details from request body
    const {
      name,
      brand,
      model,
      category,
      price,
      discount,
      rating,
      reviews,
      features,
      specifications,
      imageUrls,
      availability,
    } = req.body;

    // Input Validation (basic)
    if (!name || !brand || !model || !category || !price) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide all required fields: name, brand, model, category, and price.' });
    }

    // Create a new product instance
    const newProduct = new Product({
      name,
      brand,
      model,
      category,
      price,
      discount,
      rating,
      reviews,
      features,
      specifications,
      imageUrls,
      availability,
    });

    // Save product to the database
    await newProduct.save();

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Product added successfully!',
      data: newProduct,
    });
  } catch (error) {
    console.error('Error adding product:', error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: 'Internal Server Error. Could not add product.',
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
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    // Find and delete the product by ID
    const deletedProduct = await Product.findByIdAndDelete(id);

    // Check if product was found and deleted
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Product removed successfully!',
      data: deletedProduct,
    });
  } catch (error) {
    console.error('Error removing product:', error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: 'Internal Server Error. Could not remove product.',
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
      return res.status(400).json({ success: false, message: 'Product ID is required.' });
    }

    // Find the product by ID
    const product = await Product.findById(id);

    // Check if product was found
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully!',
      data: product,
    });
  } catch (error) {
    console.error('Error retrieving product:', error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: 'Internal Server Error. Could not retrieve product.',
      error: error.message,
    });
  }
};

// List Products Controller
const listProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Send success response
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully!',
      data: products,
    });
  } catch (error) {
    console.error('Error retrieving products:', error.message);

    // Send error response
    res.status(500).json({
      success: false,
      message: 'Internal Server Error. Could not retrieve products.',
      error: error.message,
    });
  }
};

// const getAllProducts = async (req, res) => {
//   try{
//       const products = await Product.find();
      
//   }catch(error){
//     console.error('Error fetching all products: ', error);
//     res.status(500).json({
//       success: false,
//       message: 'Internal Server Error. Could not fetch all products.',
//       error: error.message
//     });
//   }
// }

export { addProduct, removeProduct, getProduct, listProducts };
