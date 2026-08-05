import express from "express";
import {
  signup,
  login,
  findUsers,
  findUserByIdByBody,
  findUserByParams,
  userUpdate,
  deleteUser,
  addReview,
  getAllReviews,
  searchProducts,
  sendOtp,
  resetPassword,
  sendSignupOtp,
  verifySignupOtp,
  getAllProducts,
  addProduct,
  deleteProduct,
  updateProduct,
} from "../controller/userController.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const userRouter = express.Router();

userRouter.post("/signup",                signup);
userRouter.post("/login",                 login);
userRouter.get("/users",                  findUsers);
userRouter.post("/finduserbyidbybody",    findUserByIdByBody);
userRouter.get("/finduserbyparams/:id",   findUserByParams);
userRouter.put("/updateuser",             userUpdate);
userRouter.delete("/deleteuser/:id",      deleteUser);
userRouter.post("/add-review",            addReview);
userRouter.get("/get-reviews",            getAllReviews);
userRouter.get("/search",                 searchProducts);
userRouter.post("/send-otp",              sendOtp);
userRouter.post("/reset-password",        resetPassword);
userRouter.post("/send-signup-otp",       sendSignupOtp);
userRouter.post("/verify-signup-otp",     verifySignupOtp);
userRouter.get("/all-products",           getAllProducts);
userRouter.post("/api/products",          addProduct);
userRouter.delete("/api/products/:id",    deleteProduct);
userRouter.put("/api/products/:id",       updateProduct); // ✅ Edit route

// ✅ Image Upload Route — file explorer se image upload
userRouter.post("/upload-image", (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const file     = req.files.image;
    const ext      = path.extname(file.name).toLowerCase();
    const allowed  = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

    if (!allowed.includes(ext)) {
      return res.status(400).json({ success: false, message: "Only image files allowed" });
    }

    // ✅ Frontend public/images folder vich save hoga
    const uploadDir = path.join(__dirname, "../../prime/public/images");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `product_${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    file.mv(filePath, (err) => {
      if (err) return res.status(500).json({ success: false, message: err.message });
      return res.json({
        success:  true,
        message:  "Image uploaded!",
        imageUrl: `/images/${fileName}`,
      });
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default userRouter;