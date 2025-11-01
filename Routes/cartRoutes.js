import express from 'express';
import cartControllers from '../Controllers/cartControllers.js';
import auth from "../Middlewares/auth.js";
const router = express.Router();

router.use(auth);

router.post('/cart/add', cartControllers.addToCart);
router.get('/cart', cartControllers.getCartItems);
router.delete('/cart/remove', cartControllers.removeCartItem);

export default router;