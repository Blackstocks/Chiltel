// models/Ticket.js
import mongoose from "mongoose";

const responseSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    enum: ["admin", "seller"],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const ticketSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["payments", "products", "orders", "account", "technical", "other"],
    },
    status: {
      type: String,
      required: true,
      enum: ["open", "pending", "resolved", "closed"],
      default: "open",
    },
    priority: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    responses: [responseSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Ticket", ticketSchema);
