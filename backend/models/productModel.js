import mongoose from "mongoose";
import { productEnums } from "../constants/index.js";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller",
    required: function () {
      return this.requestedStatus !== undefined; // Ensure seller exists if requestedStatus is set
    },
  },
  requestedStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "approved",
    required: function () {
      return this.seller !== undefined; // Only include if seller exists
    },
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  mainCategory: {
    type: String,
    enum: ["Retail", "Domestic Appliance", "Kitchen"],
  },
  type: {
    type: String,
    enum: ["water", "cooling", "heating", "cooking", "cleaning", "display"],
  },
  category: {
    type: String,
    enum: productEnums,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 1,
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
    type: Object,
    required: true,
  },
  inStock: {
    type: Number,
    default: 0,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    type: String,
    required: true,
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

productSchema.pre("save", function (next) {
  this.availability = this.inStock > 0;
  next();
});

// Ensure requestedStatus is only set if seller exists
productSchema.pre("validate", function (next) {
  if (!this.seller) {
    this.requestedStatus = undefined; // Remove requestedStatus if seller is not present
  }
  next();
});

const Product = mongoose.model("Product", productSchema);

export default Product;
