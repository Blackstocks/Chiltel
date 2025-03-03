import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderType: {
    type: String,
    default: "product",
    enum: ["product", "service"],
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      price: Number,
    },
  ],
  services: [
    {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
      quantity: Number,
      price: Number,
    },
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ["PENDING", "ORDERED", "DELIVERED", "CANCELLED"],
    default: "PENDING",
  },
  paymentDetails: {
    method: String,
    transactionId: {
      type: String,
      default: "",
    },
    paidAt: Date,
  },
  deliveryCharge: {
    type: Number,
    default: 0,
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
  },
  orderFirstName: {
    type: String,
    default: "",
  },
  orderLastName: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  orderEmail: {
    type: String,
    default: "",
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
