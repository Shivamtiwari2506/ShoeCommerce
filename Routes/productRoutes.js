import express from "express";
import productControllers from "../Controllers/productControllers.js";
import auth from "../Middlewares/auth.js";

const router = express.Router();

router.get("/product/:_id",productControllers.getProductById);
router.get("/products" ,productControllers.getAllProducts);

router.use(auth);

router.post("/product", productControllers.createProduct);
router.put("/product/:_id", productControllers.updateProduct);
router.delete("/product/:_id", productControllers.deleteProduct);

export default router;