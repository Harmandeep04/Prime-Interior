import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name:        { type: String,   required: true },
    description: { type: String,   default: ""    },
    category:    { type: String,   default: ""    },
    price:       { type: Number,   required: true },
    image:       { type: String,   default: ""    },
    hoverImage:  { type: String,   default: ""    },
    discount:    { type: Number,   default: 0     },
    colors:      { type: [String], default: []    },

    // ✅ Homepage Section — enum validation
    homepageSection: {
        type:    String,
        default: "none",
        enum:    ["none", "ourPicks", "topSeller", "both"],
    },

    // ✅ Service Page — enum validation
    servicePage: {
        type:    String,
        default: "none",
        enum: [
            "none",
            // Interior Design
            "Living Room",
            "Modular Kitchen",
            "Bedroom Design",
            "Home Office",
            // Exterior Design
            "Garden & Landscape",
            "Terrace Design",
            "Balcony Makeover",
            "Exterior Elevation",
            // Special Services
            "Full Home Renovation",
            "Commercial Design",
            "Color Consultation",
        ],
    },

}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;