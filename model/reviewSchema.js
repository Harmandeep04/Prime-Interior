import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    comment: { type: String, default: "" },
    productName: { type: String, default: "Contrasting sheepskin..." },
    price: { type: String, default: "60.00" },
    productImg: { type: String, default: "/images/product-chair.jpg" }
}, { timestamps: true }); // timestamps naal pata laggda hai review kadon likhiya gya

const reviewDataSchema = mongoose.model("Review", reviewSchema);
export default reviewDataSchema;