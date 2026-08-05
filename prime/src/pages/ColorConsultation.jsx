import React from 'react';
import { Palette, Sun, LayoutTemplate, Home } from 'lucide-react';
import ServicePage from './ServicePage';

const ColorConsultation = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Color Consultation"
        subtitle="The right colors transform any space completely"
        description="Color is the most powerful design tool. Our expert color consultants help you choose the perfect palette for every room. We consider lighting, furniture, and your personal style to create harmonious, beautiful spaces."
        img="/images/lighting.jpg"
        features={[
            { icon: <Palette size={24} />, title: "Personalized Palette", desc: "Custom color schemes based on your style and preferences." },
            { icon: <Sun size={24} />, title: "Light Analysis", desc: "How natural and artificial light affects your colors." },
            { icon: <LayoutTemplate size={24} />, title: "Mood Boards", desc: "Visual presentations of your color story." },
            { icon: <Home size={24} />, title: "Room-by-Room", desc: "Cohesive color flow throughout your entire home." },
        ]}
        gallery={["/images/lighting.jpg", "/images/image1.jpg", "/images/image2.jpg", "/images/accessories.jpg"]}
    />
);

export default ColorConsultation;