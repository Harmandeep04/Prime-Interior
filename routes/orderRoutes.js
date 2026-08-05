import express from 'express';
import Order from '../model/Order.js';
import Cart from '../model/Cart.js';
import { sendOrderEmail, sendCancelEmail, sendStatusUpdateEmail } from '../utils/sendEmail.js';

const router = express.Router();

// POST: Place order
router.post('/', async (req, res) => {
    try {
        const { email, shippingAddress, paymentMethod, summary, items } = req.body;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
        if (!shippingAddress || !summary || !items || items.length === 0)
            return res.status(400).json({ success: false, message: 'All fields required' });

        const order = await Order.create({ email, shippingAddress, items, paymentMethod: paymentMethod || 'cod', summary });
        await Cart.findOneAndUpdate({ email }, { items: [] });
        try { await sendOrderEmail(email, order); } catch (e) { console.error('Order email error:', e.message); }
        return res.status(201).json({ success: true, orderId: order._id, message: 'Order placed successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// GET ALL (Admin)
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        return res.json({ success: true, body: orders });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// GET USER ORDERS — must be before /:id routes
router.get('/my', async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
        const orders = await Order.find({ email }).sort({ createdAt: -1 });
        return res.json({ success: true, orders });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ CLEAR CART — must be before /:id to avoid conflict
router.delete('/clear-cart', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });
    try {
        await Cart.findOneAndUpdate({ email }, { items: [] });
        return res.status(200).json({ success: true, message: 'Cart cleared successfully' });
    } catch (e) {
        return res.status(500).json({ success: false, message: e.message });
    }
});

// CANCEL ORDER (User) — must be before /:id to avoid conflict
router.put('/:id/cancel', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        console.log('CANCEL REQUEST id:', id, 'email:', email);

        if (!email)
            return res.status(400).json({ success: false, message: 'Email is required' });

        const order = await Order.findById(id);
        console.log('Order found:', order ? `status=${order.status} email=${order.email}` : 'NOT FOUND');

        if (!order)
            return res.status(404).json({ success: false, message: 'Order not found' });

        if (order.email?.trim().toLowerCase() !== email?.trim().toLowerCase()) {
            console.log('Email mismatch — order:', order.email, 'req:', email);
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }

        const cancellable = ['pending', 'confirmed'];
        if (!cancellable.includes(order.status)) {
            return res.status(400).json({
                success: false,
                message: `Order cannot be cancelled. Current status: ${order.status}`
            });
        }

        order.status = 'cancelled';
        await order.save();
        console.log('Order cancelled:', id);

        try {
            await sendCancelEmail(email, order);
            console.log('Cancel email sent to:', email);
        } catch (emailErr) {
            console.error('Cancel email error:', emailErr.message);
        }

        return res.json({ success: true, order, message: 'Order cancelled successfully' });
    } catch (err) {
        console.error('Cancel route error:', err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// UPDATE STATUS (Admin)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status))
            return res.status(400).json({ success: false, message: 'Invalid status' });

        const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        try {
            await sendStatusUpdateEmail(order.email, order, status);
            console.log('Status update email sent to:', order.email);
        } catch (emailErr) {
            console.error('Status update email error:', emailErr.message);
        }

        return res.json({ success: true, order, message: `Status updated to ${status}` });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

// ✅ DELETE ORDER (Admin) — single, clean route
router.delete('/:id', async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        return res.json({ success: true, message: 'Order deleted successfully' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
});

export default router;