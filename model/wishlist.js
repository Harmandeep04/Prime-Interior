import mongoose from 'mongoose';

// Define the product structure cleanly
const ProductSubSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true 
    }, 
    name: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    img: { 
        type: String, 
        default: '' 
    },
    color: { 
        type: String, 
        default: 'Gray' 
    },
    size: { 
        type: String, 
        default: 'Size C' 
    },
    discount: { 
        type: Number, 
        default: 0 
    }
}, { 
    _id: false,  // Stops MongoDB from auto-generating subdocument _id
    id: false    // Stops mongoose virtual id clash
});

const WishlistSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true // Auto lowercase email strings inside database queries
    },
    products: [ProductSubSchema]
}, { timestamps: true });

export default mongoose.model('Wishlist', WishlistSchema);