import { Product } from "../Models/productModels.js";
import mongoose from "mongoose";

const productControllers = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find({});
      return res.status(200).json({success: true, data: products});
    } catch (error) {
      return res.status(500).json({success: false, error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const { _id } = req.params;

      // Checking if  _id is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }

      const product = await Product.findOne({ _id });

      if (!product) {
        return res.status(404).json({success: true, error: "Product not found" });
      }

      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).json({success: false, error: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const {
        name,
        brand,
        gender,
        category,
        price,
        is_in_inventory,
        items_left,
        imageURL,
        slug,
        featured,
      } = req.body;

      if ([name, brand, gender, category, price, is_in_inventory, items_left, imageURL, slug, featured].some(field => field === undefined)) {
        return res.status(400).json({success: false, error: "All fields are required!" });
      }

      if(!["MEN", "WOMEN", "KIDS"].includes(gender))
      {
         return res.status(400).json({success: false, error:"Invalid gender"})
      }

      const product = await Product.create({
        name,
        brand,
        gender,
        category,
        price,
        is_in_inventory,
        items_left,
        imageURL,
        slug,
        featured,
      });
     
      return res.status(201).json({success: true, data: product, message: "Product created successfully" });
    } catch (error){
      return res.status(500).json({success: false, error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const {_id} = req.params;
      
      const product = await Product.findById(_id);
      if (!product) {
        return res.status(404).json({success: false, error: "Product not found" });
      }
      
      Object.assign(product, req.body);
      
      await product.save();

      return res.status(200).json({success: true, data: product, message: "Product updated successfully" });

    } catch (error) {
      return res.status(500).json({success: false, error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const {_id} = req.params;
      const product = await Product.findById(_id);
      if (!product) {
        return res.status(404).json({success: false, error: "Product not found" });
      } else {
        await product.deleteOne()
        return res.status(200).json({success: true, message: "Product deleted successfully" });
      }
    } catch (error) {
      return res.status(500).json({success: false, error: error.message });
    }
  }
};

export default productControllers;
