// models/SellerProduct.js
import mongoose from "mongoose";
import { productEnums } from "../constants/index.js";

const sellerProductSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Seller',
    required: true
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: String,
  // Extend the existing product schema
  name: { type: String, required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  mainCategory: { type: String, enum: ["Retail", "Domestic Appliance", "Kitchen"] },
  type: { type: String, enum: ["water", "cooling", "heating", "cooking", "cleaning", "display"] },
  category: { type: String, enum: productEnums, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0, min: 0, max: 1 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  features: { type: [String], default: [] },
  specifications: { type: Object, required: true },
  inStock: { type: Number, default: 0 },
  availability: { type: Boolean, default: true },
  thumbnail: { type: String, required: true },
  imageUrls: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

sellerProductSchema.pre("save", function (next) {
  this.availability = this.inStock > 0;
  next();
});

export default mongoose.model("SellerProduct", sellerProductSchema);