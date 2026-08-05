import express from 'express';
import mongoose from 'mongoose';
import Wishlist from '../model/wishlist.js';
const wishlistRouter = express.Router();
// ✅ Auto-drop the obsolete 'userId_1' index to resolve the E11000 duplicate key error
mongoose.connection.once('open', async () => {
    try {
        await mongoose.connection.db.collection('wishlists').dropIndex('userId_1');
        console.log('✅ Obsolete database index userId_1 dropped successfully!');
    } catch (err) {
        // If the index doesn't exist or is already dropped, ignore the error
    }
});
// Helper to format Mongoose subdocs to frontend-expected format
const formatProducts = (products) => {
    return products.map(p => ({
        id: p.productId || p.id || String(p._id || ''), // Handles both new 'productId', old 'id' field, and '_id' fallbacks
        _id: p.productId || p.id || String(p._id || ''),
        name: p.name,
        price: p.price,
        img: p.img,
        color: p.color,
        size: p.size,
        discount: p.discount
    }));
};
// ── GET /api/wishlist ──
wishlistRouter.get('/', async (req, res) => {
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: 'Email required' });
    
    try {
        const sanitizedEmail = String(email).trim().toLowerCase();
        const userWishlist = await Wishlist.findOne({ email: sanitizedEmail });
        return res.json({ 
            success: true, 
            wishlist: userWishlist ? formatProducts(userWishlist.products) : [] 
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
// ── POST /api/wishlist/toggle ──
wishlistRouter.post('/toggle', async (req, res) => {
    const { email, product } = req.body;
    if (!email || !product?.id) {
        return res.status(400).json({ success: false, message: 'Email and product required' });
    }
    
    try {
        const sanitizedEmail = String(email).trim().toLowerCase();
        let userWishlist = await Wishlist.findOne({ email: sanitizedEmail });
        const productIdStr = String(product.id);
        // Prep the product data to save using both fields for maximum safety and compatibility
        const productData = {
            id: productIdStr,
            productId: productIdStr,
            name: product.name,
            price: product.price,
            img: product.img || '',
            color: product.color || 'Gray',
            size: product.size || 'Size C',
            discount: product.discount || 0
        };
        if (!userWishlist) {
            userWishlist = new Wishlist({ email: sanitizedEmail, products: [productData] });
            await userWishlist.save();
            return res.json({ 
                success: true, 
                action: 'added', 
                wishlist: formatProducts(userWishlist.products) 
            });
        }
        // Check if the product already exists (looking at productId, old id, and _id)
        const exists = userWishlist.products.some(p => 
            String(p.productId || '') === productIdStr || 
            String(p.id || '') === productIdStr || 
            String(p._id || '') === productIdStr
        );
        if (exists) {
            // Remove ALL duplicates of this product to clean up any corrupted database states
            userWishlist.products = userWishlist.products.filter(p => 
                String(p.productId || '') !== productIdStr && 
                String(p.id || '') !== productIdStr && 
                String(p._id || '') !== productIdStr
            );
            await userWishlist.save();
            return res.json({ 
                success: true, 
                action: 'removed', 
                wishlist: formatProducts(userWishlist.products) 
            });
        } else {
            // Add it if it wasn't there
            userWishlist.products.push(productData);
            await userWishlist.save();
            return res.json({ 
                success: true, 
                action: 'added', 
                wishlist: formatProducts(userWishlist.products) 
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});
export default wishlistRouter;
