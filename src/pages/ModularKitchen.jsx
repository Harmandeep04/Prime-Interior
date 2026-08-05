import React from 'react';
import { Archive, Wrench, Gem, LayoutDashboard } from 'lucide-react';
import ServicePage from './ServicePage';

const ModularKitchen = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Modular Kitchen"
        subtitle="Smart, stylish kitchens designed for modern living"
        description="A well-designed kitchen makes cooking a joy. We specialize in modular kitchens that maximize storage, optimize workflow, and look stunning. From sleek modern to warm traditional, we design kitchens you'll love."
        img="/images/image2.jpg"
        features={[
            { icon: <Archive size={24} />, title: "Smart Storage", desc: "Innovative storage solutions to keep your kitchen organized." },
            { icon: <Wrench size={24} />, title: "Quality Hardware", desc: "Premium fittings and accessories for lasting durability." },
            { icon: <Gem size={24} />, title: "Premium Materials", desc: "High-quality countertops, cabinets, and finishes." },
            { icon: <LayoutDashboard size={24} />, title: "Custom Layout", desc: "Designed around your cooking style and space." },
        ]}
        gallery={["/images/image2.jpg", "/images/image1.jpg", "/images/lighting.jpg", "/images/accessories.jpg"]}
    />
);

export default ModularKitchen;