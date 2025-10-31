import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {

    name: { type: String, required: true},
    brand: { type: String, required: true },
    gender: { type: String, enum: ["MEN", "WOMEN", "KIDS"], required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    is_in_inventory: { type: Boolean, required: true },
    items_left: { type: Number, required: true },
    imageURL: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    featured: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
