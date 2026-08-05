import React from 'react';
import { TreeDeciduous, Mountain, Layers, Sparkles } from 'lucide-react';
import ServicePage from './ServicePage';

const FlooringRugs = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Flooring & Rugs"
        subtitle="The foundation of beautiful interior design"
        description="The right flooring sets the tone for your entire space. We offer expert guidance on hardwood, marble, tiles, and luxury vinyl, plus a stunning collection of handwoven rugs that anchor every room perfectly."
        img="/images/decor-office.jpg"
        features={[
            { icon: <TreeDeciduous size={24} />, title: "Hardwood Floors", desc: "Timeless hardwood in multiple species and finishes." },
            { icon: <Mountain size={24} />, title: "Marble & Stone", desc: "Luxurious natural stone for lasting elegance." },
            { icon: <Layers size={24} />, title: "Handwoven Rugs", desc: "Artisan rugs that define and warm any space." },
            { icon: <Sparkles size={24} />, title: "Luxury Vinyl", desc: "Durable, beautiful alternatives to natural materials." },
        ]}
        gallery={["/images/decor-office.jpg", "/images/image1.jpg", "/images/storage.jpg", "/images/image2.jpg"]}
    />
);

export default FlooringRugs;