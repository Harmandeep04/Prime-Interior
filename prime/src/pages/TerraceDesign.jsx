import React from 'react';
import { CloudSun, Armchair, Sprout, Sun } from 'lucide-react';
import ServicePage from './ServicePage';

const TerraceDesign = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Terrace Design"
        subtitle="Transform your terrace into an outdoor living room"
        description="A well-designed terrace adds valuable living space to your home. We design terraces that are comfortable, stylish, and perfect for entertaining or relaxing. Weather-resistant materials meet beautiful design."
        img="/images/image2.jpg"
        features={[
            { icon: <CloudSun size={24} />, title: "Weather-Resistant", desc: "Materials that withstand the elements beautifully." },
            { icon: <Armchair size={24} />, title: "Outdoor Furniture", desc: "Comfortable, stylish furniture for outdoor living." },
            { icon: <Sprout size={24} />, title: "Container Gardens", desc: "Beautiful planters and vertical gardens." },
            { icon: <Sun size={24} />, title: "Shade Solutions", desc: "Pergolas, awnings, and shade structures." },
        ]}
        gallery={["/images/image2.jpg", "/images/storage.jpg", "/images/image1.jpg", "/images/lighting.jpg"]}
    />
);

export default TerraceDesign;