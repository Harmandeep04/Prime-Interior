import express from 'express';
import Cart from '../model/Cart.js';
const router = express.Router();

// ── API 1: GET USER CART ──
// ਹੁਣ ਇਹਦਾ ਅਸਲੀ URL ਬਣੇਗਾ: GET http://localhost:5555/api/cart
router.get('/', async (req, res) => { 
    const { email } = req.query;
    if (!email) return res.status(400).json({ success: false, message: "Email required" });
    try {
        const userCart = await Cart.findOne({ email });
        return res.status(200).json({ success: true, cart: userCart ? userCart.items : [] });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
});

// ── API 2: ADD / SYNC CART ITEMS ──
// ਹੁਣ ਇਹਦਾ ਅਸਲੀ URL ਬਣੇਗਾ: POST http://localhost:5555/api/cart/sync
router.post('/sync', async (req, res) => { 
    const { email, items } = req.body;
    try {
        let userCart = await Cart.findOne({ email });
        if (!userCart) {
            userCart = new Cart({ email, items });
        } else {
            userCart.items = items; 
        }
        await userCart.save();
        return res.status(200).json({ success: true, cart: userCart.items });
    } catch (e) { return res.status(500).json({ success: false, error: e.message }); }
});

export default router;