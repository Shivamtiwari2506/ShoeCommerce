import { Testimonial } from "../Models/testimonialModels.js";

const testimonialControllers = {
   getAllTestimony: async (req, res) => {
      try {
         const testimonies = await Testimonial.find()
         .populate('userId', 'userName profileImageUrl')
         .sort({ _id: -1 });
         return res.status(200).json({success: true, data: testimonies});
      } catch (error) {
         return res.status(500).json({success: false, error: error.message });
      }
   },

   createTestimony: async (req, res) => {
      try {
         const { userId, message, rating } = req.body;
         const newTestimony = await Testimonial.create({userId, message, rating });

         return res.status(200).json({success: true, message: "Testimony added successfully"});
      } catch (error) {
         return res.status(500).json({success: false, error: error.message });
      }
   },
};

export default testimonialControllers;