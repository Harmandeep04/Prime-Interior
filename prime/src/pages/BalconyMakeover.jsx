import React from 'react';
import { Maximize2, Leaf, Lamp, Armchair } from 'lucide-react';
import ServicePage from './ServicePage';

const BalconyMakeover = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Balcony Makeover"
        subtitle="Small space, big impact — beautiful balcony designs"
        description="Even the smallest balcony can become a stunning outdoor retreat. We maximize every inch with smart furniture, beautiful plants, and thoughtful lighting to create your perfect outdoor escape."
        img="/images/accessories.jpg"
        features={[
            { icon: <Maximize2 size={24} />, title: "Space Optimization", desc: "Smart solutions for small balcony spaces." },
            { icon: <Leaf size={24} />, title: "Vertical Gardens", desc: "Beautiful plant walls for privacy and greenery." },
            { icon: <Lamp size={24} />, title: "Ambient Lighting", desc: "String lights and lanterns for cozy evenings." },
            { icon: <Armchair size={24} />, title: "Compact Furniture", desc: "Space-saving furniture that doesn't compromise comfort." },
        ]}
        gallery={["/images/accessories.jpg", "/images/image1.jpg", "/images/storage.jpg", "/images/image2.jpg"]}
    />
);

export default BalconyMakeover;