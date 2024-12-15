import Product from '../models/productModel'; // Path to your Product model

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

module.exports = addProduct;