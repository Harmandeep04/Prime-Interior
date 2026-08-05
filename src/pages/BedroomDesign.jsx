import React from 'react';
import { LayoutGrid, Moon, Palette, Sparkles } from 'lucide-react';
import ServicePage from './ServicePage';

const BedroomDesign = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Bedroom Design"
        subtitle="Your personal retreat — designed for rest and relaxation"
        description="Your bedroom should be your sanctuary. We design bedrooms that are calming, beautiful, and perfectly suited to your needs. From master suites to children's rooms, every bedroom we design tells your unique story."
        img="/images/banner-lookbook.jpg"
        features={[
            { icon: <LayoutGrid size={24} />, title: "Custom Wardrobes", desc: "Built-in wardrobes designed for maximum storage." },
            { icon: <Moon size={24} />, title: "Sleep-Friendly Lighting", desc: "Lighting designed to promote rest and relaxation." },
            { icon: <Palette size={24} />, title: "Calming Palettes", desc: "Color schemes that promote peace and tranquility." },
            { icon: <Sparkles size={24} />, title: "Luxury Finishes", desc: "Premium materials for a hotel-like experience." },
        ]}
        gallery={["/images/banner-lookbook.jpg", "/images/image1.jpg", "/images/product-chair.jpg", "/images/image2.jpg"]}
    />
);

export default BedroomDesign;