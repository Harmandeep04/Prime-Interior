import React from 'react';
import { Monitor, BookOpen, Lightbulb, Cable } from 'lucide-react';
import ServicePage from './ServicePage';

const HomeOffice = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Home Office Design"
        subtitle="Productive, inspiring workspaces at home"
        description="Working from home doesn't mean compromising on style. We design home offices that boost productivity while looking great. Ergonomic, functional, and beautifully designed — your ideal workspace awaits."
        img="/images/decor-office.jpg"
        features={[
            { icon: <Monitor size={24} />, title: "Ergonomic Setup", desc: "Furniture and layout designed for comfort and productivity." },
            { icon: <BookOpen size={24} />, title: "Smart Storage", desc: "Organized shelving and storage for a clutter-free workspace." },
            { icon: <Lightbulb size={24} />, title: "Task Lighting", desc: "Proper lighting to reduce eye strain and boost focus." },
            { icon: <Cable size={24} />, title: "Cable Management", desc: "Clean, organized cable solutions for a tidy desk." },
        ]}
        gallery={["/images/decor-office.jpg", "/images/office-chair.jpg", "/images/image1.jpg", "/images/lighting.jpg"]}
    />
);

export default HomeOffice;