import express from "express";
import userControllers from "../Controllers/userControllers.js";
import { body} from "express-validator";
import multer from "multer";

const router = express.Router();

const upload = multer({
   storage: multer.memoryStorage(),
   limits: { fileSize: 5 * 1024 * 1024 },
   fileFilter: (req, file, cb) => {
     if (file.mimetype.startsWith('image/')) {
       cb(null, true);  // Accept image files
     } else {
       cb(new Error('Only images allowed!'), false);
     }
   }
 });

const validateUser = [
   body("userName").notEmpty().withMessage("Name is required"),
   body("email").isEmail().withMessage("Email is required"),
   body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

router.post("/users/signup", upload.single('profileImageUrl'), validateUser, userControllers.signup);
router.post("/users/login", validateUser, userControllers.login);
router.delete("/users/:_id", userControllers.deleteUser);
router.get("/users/:_id", userControllers.getUserData);

export default router;