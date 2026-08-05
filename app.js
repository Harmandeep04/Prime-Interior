import express from 'express';
import dbConnectDB from './connect/dbconnect.js';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import cartRouter from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';  
import cors from 'cors';
import dotenv from "dotenv";
import wishlistRouter from './routes/wishlistroutes.js';
import consultationRoutes from './routes/consultationRoutes.js'; 
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(fileUpload());
app.use(cors());

// ✅ Serve images from backend/images folder
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
app.use('/images', express.static(imagesDir));

// ✅ Upload endpoint – saves to backend/images
app.post('/upload/image', (req, res) => {
  if (!req.files || !req.files.image) {
    return res.status(400).json({ success: false, message: 'No image file' });
  }
  const image = req.files.image;
  if (!image.mimetype.startsWith('image/')) {
    return res.status(400).json({ success: false, message: 'Not an image' });
  }
  if (image.size > 5 * 1024 * 1024) {
    return res.status(400).json({ success: false, message: 'Max 5MB' });
  }
  const ext = path.extname(image.name);
  const fileName = `product_${Date.now()}${ext}`;
  const uploadPath = path.join(imagesDir, fileName);
  
  image.mv(uploadPath, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ success: false, message: 'Save failed' });
    }
    // Return absolute URL (frontend will use it directly)
    const imageUrl = `http://localhost:5555/images/${fileName}`;
    res.json({ success: true, url: imageUrl });
  });
});

const port = 5555;

// Database Connection
dbConnectDB();

// API Routes
app.use("/user", userRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRoutes);   
app.use('/api/consultations', consultationRoutes);

// Voucher Validation Route
app.post('/api/validate-voucher', (req, res) => {
    const { code, subtotal } = req.body;
    if (subtotal < 500) {
        return res.json({ valid: false, message: "Discount code is only used for orders over $500.00" });
    }
    if (code && code.toUpperCase() === 'SAVE80') {
        return res.json({ valid: true, discountAmount: 80.00 });
    } else {
        return res.json({ valid: false, message: "Invalid Coupon Code" });
    }
});

// Server Listen
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});