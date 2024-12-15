import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Air Conditioner', 'Water Heater', 'Microwave', 'Geyser', 'Refrigerator'],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
  },
  features: {
    type: [String], // Array of features
    default: [],
  },
  specifications: {
    capacity: {
      type: String, // e.g., "1 Tons", "29L", "10L/15L/25L"
      required: false,
    },
    starRating: {
      type: String, // e.g., "3 Star", "5 Star"
      required: false,
    },
    powerConsumption: {
      type: String, // e.g., "2000W"
      required: false,
    },
    cooling: {
      type: String, // e.g., "12K BTU"
      required: false,
    },
    ambientOperation: {
      type: String, // e.g., "High Ambient up to 52°C"
      required: false,
    },
    waterproofRating: {
      type: String, // e.g., "IPX4"
      required: false,
    },
  },
  availability: {
    type: Boolean,
    default: true,
  },
  imageUrls: {
    type: [String], // Array of image URLs
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
