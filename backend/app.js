import express from 'express';
import dbConnectDB from './connect/dbConnect.js';
import fileUpload from 'express-fileupload';
import userRouter from './routes/userRouter.js';
import cartRouter from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';  
import cors from 'cors';
import dotenv from "dotenv";
import wishlistRouter from './routes/wishlistRoutes.js';
import consultationRoutes from './routes/consultationRoutes.js'; 
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cloudinary from './config/cloudinary.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(fileUpload());
app.use(cors());

// ✅ Serve images from backend/images folder (purane local images layi, migration tak)
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}
app.use('/images', express.static(imagesDir));

// ✅ Upload endpoint – ab Cloudinary te save hunda hai (permanent storage)
app.post('/upload/image', async (req, res) => {
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

  try {
    const base64 = `data:${image.mimetype};base64,${image.data.toString('base64')}`;
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'prime-interior-products',
    });

    res.json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    res.status(500).json({ success: false, message: 'Cloudinary upload failed' });
  }
});

const PORT = process.env.PORT || 5555;

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
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});