import wishlistController from "../Controllers/wishlistControllers.js";
import express from 'express';
import auth from "../Middlewares/auth.js";
import wishlistControlers from "../Controllers/wishlistControllers.js";

const router = express.Router();

router.use(auth);
router.post('/add-to-wishlist', wishlistControlers.addToWishlist);
router.get('/wishlist', wishlistControlers.getUserWishist);

export default router;