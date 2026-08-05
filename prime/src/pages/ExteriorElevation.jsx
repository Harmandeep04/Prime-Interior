import React from 'react';
import { Home, DoorOpen, Palette, Lightbulb } from 'lucide-react';
import ServicePage from './ServicePage';

const ExteriorElevation = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Exterior Elevation"
        subtitle="Make a stunning first impression with beautiful exteriors"
        description="Your home's exterior is the first thing people see. We design exterior elevations that are architecturally beautiful, weather-resistant, and uniquely yours. From traditional to contemporary, we transform facades."
        img="/images/image1.jpg"
        features={[
            { icon: <Home size={24} />, title: "Facade Design", desc: "Beautiful exterior cladding and finish options." },
            { icon: <DoorOpen size={24} />, title: "Entrance Design", desc: "Grand entrances that make a lasting impression." },
            { icon: <Palette size={24} />, title: "Exterior Colors", desc: "Color schemes that complement the surroundings." },
            { icon: <Lightbulb size={24} />, title: "Exterior Lighting", desc: "Security and aesthetic lighting for your home." },
        ]}
        gallery={["/images/image1.jpg", "/images/image2.jpg", "/images/banner-lookbook.jpg", "/images/storage.jpg"]}
    />
);

export default ExteriorElevation;