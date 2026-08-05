import React from 'react';
import { Sofa, Lightbulb, Palette, Flower2 } from 'lucide-react';
import ServicePage from './ServicePage';

const LivingRoom = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Living Room Design"
        subtitle="Transform your living space into a stunning sanctuary"
        description="Your living room is the heart of your home. At Prime Interior, we design living spaces that perfectly balance comfort, style, and functionality. From contemporary to classic, we create spaces that reflect your personality."
        img="/images/image1.jpg"
        features={[
            { icon: <Sofa size={24} />, title: "Custom Furniture", desc: "Handpicked furniture tailored to your space and style." },
            { icon: <Lightbulb size={24} />, title: "Lighting Design", desc: "Ambient, task, and accent lighting for the perfect mood." },
            { icon: <Palette size={24} />, title: "Color Palette", desc: "Expert color consultation for a cohesive look." },
            { icon: <Flower2 size={24} />, title: "Decor & Styling", desc: "Finishing touches that bring the space to life." },
        ]}
        gallery={["/images/image1.jpg", "/images/image2.jpg", "/images/product-chair.jpg", "/images/storage.jpg"]}
    />
);

export default LivingRoom;