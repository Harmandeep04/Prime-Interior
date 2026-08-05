import React from 'react';
import { Hand, Layers, Ruler, Truck } from 'lucide-react';
import ServicePage from './ServicePage';

const LuxuryFurniture = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Luxury Furniture"
        subtitle="Handcrafted pieces that define your space"
        description="Our luxury furniture collection features handcrafted pieces from the finest artisans. Each piece is selected for its quality, craftsmanship, and timeless design. Elevate your home with furniture that tells a story."
        img="/images/product-chair.jpg"
        features={[
            { icon: <Hand size={24} />, title: "Handcrafted", desc: "Each piece crafted by skilled artisans." },
            { icon: <Layers size={24} />, title: "Premium Materials", desc: "Finest woods, fabrics, and metals." },
            { icon: <Ruler size={24} />, title: "Custom Sizing", desc: "Made-to-measure for your exact space." },
            { icon: <Truck size={24} />, title: "White Glove Delivery", desc: "Professional delivery and installation." },
        ]}
        gallery={["/images/product-chair.jpg", "/images/product-2.1.jpg", "/images/product-3.2.jpg", "/images/product-4.2.jpg"]}
    />
);

export default LuxuryFurniture;