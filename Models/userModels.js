import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      unique: true,
      required: true,
    },
    profileImageUrl: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);