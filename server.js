import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./DB/connectDB.js";
import cors from "cors";

import productRoutes from "./Routes/productRoutes.js";
import userRoutes from "./Routes/userRoutes.js";
import testimonialRoutes from "./Routes/testimonialRoutes.js";
import authRoutes from "./Routes/authRoutes.js";
import cartRoutes from './Routes/cartRoutes.js';
import cloudinary from 'cloudinary';
import cookieParser from "cookie-parser";
import wishlistRoutes from './Routes/wishlistRoutes.js';


cloudinary.v2.config({
cloud_name: process.env.CLOUD_NAME,
api_key: process.env.CLOUD_API_KEY,
api_secret: process.env.CLOUD_API_SECRET,
secure: true
});

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(cors({
  origin: [process.env.CLIENT_URL, "http://localhost:5173"].filter(Boolean),
  credentials: true,
}
));
app.use(express.json());
app.use(cookieParser());

//custom middleware
app.use((req,res,next)=>{
  console.log("http Method- "+req.method+", URL- "+req.url + ",  userId-  "+ req.body);
  next();
})

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", testimonialRoutes);
app.use('/api', cartRoutes);
app.use('/api', wishlistRoutes);

app.listen(PORT, () => {
  console.log(`server is running on  port ${PORT}`);
});
