import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  subDescription: { type: String, required: true },
  specification: { type: String, required: true },
  //   review: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: Array, required: true },
  mainCategory: { type: String, required: true },
  type: { type: String, required: true },
  bestseller: { type: Boolean },
  date: { type: Number, required: true },
  rating: { type: Number, required: true },
  color: { type: String, required: true },
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
