import React from 'react';
import { Lightbulb, Flashlight, Star, SlidersHorizontal } from 'lucide-react';
import ServicePage from './ServicePage';

const DesignerLighting = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Designer Lighting"
        subtitle="Illuminate your space with stunning designer lights"
        description="Lighting transforms a room completely. Our curated collection of designer lighting includes statement chandeliers, sleek pendants, and subtle accent lights. The perfect lighting makes every space magical."
        img="/images/lighting.jpg"
        features={[
            { icon: <Lightbulb size={24} />, title: "Ambient Lighting", desc: "Soft, overall illumination for comfort." },
            { icon: <Flashlight size={24} />, title: "Task Lighting", desc: "Focused light for work and reading." },
            { icon: <Star size={24} />, title: "Accent Lighting", desc: "Highlight architectural features and artwork." },
            { icon: <SlidersHorizontal size={24} />, title: "Smart Controls", desc: "Dimmable and smart lighting solutions." },
        ]}
        gallery={["/images/lighting.jpg", "/images/image1.jpg", "/images/decor-office.jpg", "/images/accessories.jpg"]}
    />
);

export default DesignerLighting;