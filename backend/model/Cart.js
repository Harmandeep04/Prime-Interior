import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    items: [
        {
            id:    { type: Number, required: true },
            name:  { type: String, required: true },
            price: { type: Number, required: true },
            img:   { type: String, required: true },
            qty:   { type: Number, default: 1 },
            color: { type: String, default: 'Default' },
            size:  { type: String, default: 'Standard' }
        }
    ]
}, { timestamps: true });

export default mongoose.model('Cart', CartSchema);