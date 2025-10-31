import express from "express";
import productControllers from "../Controllers/productControllers.js";
import auth from "../Middlewares/auth.js";

const router = express.Router();

router.get("/products/:_id",productControllers.getProductById);
router.get("/products" ,productControllers.getAllProducts);

router.use(auth);

router.post("/product", productControllers.createProduct);
router.put("/products/:_id", productControllers.updateProduct);
router.delete("/product/:_id", productControllers.deleteProduct);

export default router;