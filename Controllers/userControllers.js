import { User } from "../Models/userModels.js";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from 'cloudinary';
import { decryptData, encryptData } from "../utils/commonFunction.js";

const generateTokens = (userId, email) => {
  const accessToken = jwt.sign(
    { id: userId, email},
    process.env.SECRET_KEY,
    {expiresIn: "30m"}
  );

  const refreshToken = jwt.sign(
    {id: userId, email},
    process.env.REFRESH_SECRET_KEY,
    {expiresIn: "24h"}
  );

  return {accessToken, refreshToken};
}

const userControllers = {
  signup: async (req, res) => {
    try {
      const encryptedBody = req.body; //encrypted request
      if (!encryptedBody) {
        return res.status(400).json({ message: "Encrypted data is required" });
      }
      const decryptedBody = decryptData(encryptedBody?.payload); // decrypt the request
      const { userName, email, password, mobileNumber } = decryptedBody; // destructure  the decrypted data
      const errors = validationResult(decryptedBody);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: errors.array().map((err) => err.msg) });
      }

      const existingUser = await User.findOne({
        $or: [{ email }, { mobileNumber }],
      });
      
      if (existingUser) {
        return res.status(400).json({
          message:
            existingUser.email === email
              ? "User with this email already exists, please sign in!"
              : "This phone number is already registered with an account, please sign in!",
        });
      }
      

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Prepare user data
      const userData = {
        userName,
        email,
        mobileNumber,
        password: hashedPassword,
      };

      // Handle profile image upload
      if (req.file) {
        const uploadResult = await new Promise((resolve, reject) => {
          const stream = cloudinary.v2.uploader.upload_stream(
            { folder: "users" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(req.file.buffer);
        });
      
        userData.profileImageUrl = uploadResult.secure_url;
      }      

      // Create new user
      const newUser = await User.create(userData);

      const { accessToken, refreshToken } = generateTokens(newUser._id, newUser.email);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })

      return res.status(201).json({
        success: true,
        message:  `${newUser.userName}!!, you have signed up successfully`,
        user_id: newUser._id,
        accessToken: accessToken,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const encryptedBody = req.body.payload;
      const decryptedBody = decryptData(encryptedBody);
      const { identifier, password } = decryptedBody;
      if (!identifier || !password) {
        return res.status(400).json({ message: "Identifier and password are required" });
      }

      const isEmail = /\S+@\S+\.\S+/.test(identifier);
      let user;
  
      if (isEmail) {
        user = await User.findOne({ email: identifier });
      } else {
        user = await User.findOne({ mobileNumber: identifier });
      }
  
      // Check user exists
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({message: "Invalid password" });
      }
  
      const { accessToken, refreshToken } = generateTokens(user._id, user.email);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })

      return res
        .status(200)
        .json({
          success: true,
          message: `${user.userName}!!, you have logged in successfully`,
          user_id: user._id, 
          accessToken: accessToken
        });
    } catch (error) {
      return res.status(500).json({success: false, error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { _id } = req.params;
      const user = await User.findById(_id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      await user.deleteOne();
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  getUserData: async (req, res) => {
    try {
      const { _id } = req.params;
      const user = await User.findById(_id).select('-password'); // Exclude password
      if (!user) {
        return res.status(404).json({success: false, error: "User not found" });
      }
      return res.status(200).json({success: true, data: encryptData(user) });
    } catch (error) {
      return res.status(500).json({success: false, error: error.message });
    }
  }
};

export default userControllers;
