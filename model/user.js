import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true,
        default: ""
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        default: ""
    }
}, { timestamps: true });

// Agar model pehle ton banya hove taan use karo, nahi taan nva create karo
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;