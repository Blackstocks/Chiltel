import mongoose from "mongoose";
import userModel from "./userModel.js";
import Service from "./serviceModel.js";
import Rider from "./riderModel.js";
import { faults } from "../constants/index.js";
// Service Request Schema
const serviceRequestSchema = {
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: userModel,
    required: true,
  },
  services: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Service,
        required: true,
      },
      count: Number,
    },
  ],
  rider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rider",
  },
  status: {
    type: String,
    enum: [
      "CREATED",
      "ASSIGNED",
      "REQUESTED",
      "PAID",
      "IN_PROGRESS",
      "COMPLETED",
      "CANCELLED",
    ],
    default: "CREATED",
  },
  workStarted: { type: Boolean, default: false },
  addedWorks: [{ type: Object, default: {} }],
  requestedRiders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rider",
    },
  ],
  userLocation: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
    },
    coordinates: [Number], // [longitude, latitude]
    address: String,
  },
  scheduledFor: Date,
  price: Number,
  rating: Number,
  paymentStatus: {
    type: String,
    enum: ["PENDING", "PAID", "REFUNDED"],
    default: "PENDING",
  },
  paymentDetails: {
    method: String,
    transactionId: String,
    paidAt: Date,
  },
  faults: {
    type: { type: String, enum: faults },
    note: String,
    images: [String],
  },
  repair: {
    description: String,
    rectifiedImages: [String],
    spareImages: [String],
  },
  OTP: {
    type: Number,
  },
  remarks: String,
  completedAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
};

const ServiceRequest = mongoose.model("ServiceRequest", serviceRequestSchema);

export default ServiceRequest;
