import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   message: { type: String, required: true },
   rating: { type: Number, required: true, min: 1, max: 5 },
})

export const Testimonial = mongoose.model('Testimonial', testimonialSchema);