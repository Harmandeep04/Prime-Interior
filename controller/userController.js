import userDataSchema from "../model/userSchema.js";
import bcrypt from "bcrypt";
import reviewDataSchema from "../model/reviewSchema.js";
import Product from "../model/productSchema.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

// ✅ Signup OTP Store (in-memory)
const signupOtpStore = {};

export const signup = async (req, res) => {
  try {
    const findEmail = await userDataSchema.findOne({ email: req.body.email });
    if (findEmail !== null) {
      return res.json({ success: false, status: 400, message: "Email already exists", body: {} });
    } else {
      const encPass = await bcrypt.hash(req.body.password, 10);
      const data = await userDataSchema.create({ ...req.body, password: encPass });
      return res.json({ status: 200, success: true, message: "Signup successful", body: data });
    }
  } catch (error) {
    return res.json({ success: false, message: error, body: {} });
  }
};

export const login = async (req, res) => {
  try {
    const data = await userDataSchema.findOne({ email: req.body.email });
    if (!req.body.email) {
      return res.json({ success: false, status: 400, message: "Email is required", body: {} });
    } else if (!req.body.password) {
      return res.json({ success: false, status: 400, message: "Password is required", body: {} });
    } else if (data === null) {
      return res.json({ success: false, status: 400, message: "email is not valid", body: {} });
    } else {
      const decPass = await bcrypt.compare(req.body.password, data.password);
      if (!decPass) {
        return res.json({ success: false, status: 400, message: "Password is not match", body: {} });
      } else {
        return res.json({ success: true, status: 200, message: "User login successfully", body: { data } });
      }
    }
  } catch (error) {
    return res.json({ success: false, status: 400, message: error, body: {} });
  }
};

export const findUsers = async (req, res) => {
  try {
    const data  = await userDataSchema.find();
    const count = await userDataSchema.countDocuments();
    return res.json({ status: 200, success: true, message: "All users are here", body: data, count });
  } catch (error) {
    return res.json({ status: 400, success: false, message: error, body: {} });
  }
};

export const findUserByIdByBody = async (req, res) => {
  try {
    const data = await userDataSchema.findById(req.body.id);
    return res.json({ status: 200, success: true, message: "This is single user", body: data });
  } catch (error) {
    console.log(error);
  }
};

export const findUserByParams = async (req, res) => {
  try {
    const data = await userDataSchema.findById({ _id: req.params.id });
    return res.json({ status: 200, success: true, message: "This is user by params", body: data });
  } catch (error) {
    console.log(error);
  }
};

export const userUpdate = async (req, res) => {
  try {
    const { userId, firstName, lastName, phone } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID missing" });
    }
    const updatedUser = await userDataSchema.findByIdAndUpdate(
      userId,
      { firstName, lastName, phone },
      { new: true, runValidators: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    return res.status(200).json({ success: true, message: "Profile updated successfully!", body: userResponse });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const data  = await userDataSchema.findByIdAndDelete({ _id: req.params.id });
    const count = await userDataSchema.countDocuments();
    return res.json({ status: 200, success: true, message: "User deleted successfully", body: count, data });
  } catch (error) {
    console.log(error);
  }
};

export const addReview = async (req, res) => {
  try {
    const data = await reviewDataSchema.create(req.body);
    return res.json({ status: 200, success: true, message: "Review added successfully", body: data });
  } catch (error) {
    return res.json({ success: false, status: 400, message: error.message || "Something went wrong", body: {} });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const data = await reviewDataSchema.find().sort({ createdAt: -1 });
    return res.json({ status: 200, success: true, message: "All reviews fetched successfully", body: data });
  } catch (error) {
    return res.json({ status: 400, success: false, message: error.message || "Error fetching reviews", body: [] });
  }
};

export const searchProducts = async (req, res) => {
  const query = req.query.q;
  try {
    const products = await Product.find({
      $or: [
        { name:     { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Search failed", error });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userDataSchema.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Email not registered! ❌" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await sendOtpEmail(email, otp);
    return res.json({ success: true, message: "OTP sent to your email! 📧", otp: otp });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await userDataSchema.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found with this email." });
    }
    return res.status(200).json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Reset password error:", error.message);
    return res.status(500).json({ success: false, message: "Server error. Try again." });
  }
};

export const sendSignupOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const existingUser = await userDataSchema.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered! Please login. ❌" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    signupOtpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
    };
    await sendOtpEmail(email, otp);
    return res.json({ success: true, message: "OTP sent to your email! 📧" });
  } catch (error) {
    return res.json({
      success: false,
      message: "Could not send OTP. Please check your email address. ❌",
    });
  }
};

export const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const record = signupOtpStore[email];
    if (!record) {
      return res.json({ success: false, message: "OTP not found. Please request again. ❌" });
    }
    if (Date.now() > record.expiresAt) {
      delete signupOtpStore[email];
      return res.json({ success: false, message: "OTP expired. Please request again. ⏰" });
    }
    if (record.otp !== otp) {
      return res.json({ success: false, message: "Invalid OTP. Please try again. ❌" });
    }
    delete signupOtpStore[email];
    return res.json({ success: true, message: "Email verified successfully! ✅" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ✅ getAllProducts — Homepage layi
export const getAllProducts = async (req, res) => {
  try {
    const data  = await Product.find().sort({ createdAt: -1 });
    const count = data.length;
    return res.json({ success: true, status: 200, message: "All products", body: data, count });
  } catch (error) {
    return res.json({ success: false, status: 400, message: error.message, body: [] });
  }
};
// ✅ Ye route add karo — Admin panel product add karda hai iss se
export const addProduct = async (req, res) => {
  try {
    const data = await Product.create(req.body);
    return res.json({ success: true, status: 201, message: "Product added!", body: data });
  } catch (error) {
    return res.json({ success: false, status: 400, message: error.message, body: {} });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Product deleted!" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const data = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json({ success: true, status: 200, message: "Product updated!", body: data });
  } catch (error) {
    return res.json({ success: false, status: 400, message: error.message });
  }
};