import mongoose from 'mongoose';

const consultationSchema = new mongoose.Schema({
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, trim: true },
    phone:   { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true },
    status:  {
        type: String,
        enum: ['pending', 'in-progress', 'completed'],
        default: 'pending',
    },
}, { timestamps: true });

const Consultation = mongoose.model('Consultation', consultationSchema);
export default Consultation;