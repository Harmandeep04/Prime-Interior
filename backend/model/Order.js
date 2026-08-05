import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    shippingAddress: {
        firstName: String,
        lastName:  String,
        email:     String,
        phone:     String,
        country:   String,
        city:      String,
        street:    String,
        state:     String,
        postal:    String,
        note:      String,
    },
    items: [{
        id:    Number,
        name:  String,
        price: Number,
        img:   String,
        color: String,
        size:  String,
        qty:   Number,
    }],
    paymentMethod: {
        type:    String,
        enum:    ['credit', 'cod', 'apple', 'paypal'],
        default: 'cod'
    },
    summary: {
        subtotal:     Number,
        shippingCost: Number,
        discount:     Number,
        total:        Number,
    },
    status: {
        type:    String,
        enum:    ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);