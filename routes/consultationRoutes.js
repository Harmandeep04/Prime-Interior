import express from 'express';
import Consultation from '../model/Consultation.js'; 

const router = express.Router();

// ── POST /api/consultations — new booking ──
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email and message are required.' });
        }
        const consultation = new Consultation({ name, email, phone, message });
        await consultation.save();
        res.status(201).json({ success: true, message: 'Consultation booked successfully!', body: consultation });
    } catch (err) {
        console.error('Consultation POST error:', err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ── GET /api/consultations — all bookings (admin) ──
router.get('/', async (req, res) => {
    try {
        const consultations = await Consultation.find().sort({ createdAt: -1 });
        res.json({ success: true, body: consultations });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ── PATCH /api/consultations/:id — update status ──
router.patch('/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updated = await Consultation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!updated) return res.status(404).json({ success: false, message: 'Not found.' });
        res.json({ success: true, body: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// ── DELETE /api/consultations/:id ──
router.delete('/:id', async (req, res) => {
    try {
        await Consultation.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Deleted.' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

export default router;