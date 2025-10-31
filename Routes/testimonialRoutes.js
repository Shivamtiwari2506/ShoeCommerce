import express from 'express';
import testimonialControllers from '../Controllers/testimonialControllers.js';
import auth from '../Middlewares/auth.js';

const router = express.Router();

router.get('/testimonials', testimonialControllers.getAllTestimony);
router.use(auth);
router.post('/create/testimonial', testimonialControllers.createTestimony);

export default router;