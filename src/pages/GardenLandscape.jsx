import React from 'react';
import { Leaf, Droplets, Milestone, Moon } from 'lucide-react';
import ServicePage from './ServicePage';

const GardenLandscape = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Garden & Landscape"
        subtitle="Beautiful outdoor spaces that connect you with nature"
        description="Your garden is an extension of your home. We design outdoor spaces that are beautiful, functional, and sustainable. From lush gardens to minimalist landscapes, we create outdoor retreats you'll love."
        img="/images/storage.jpg"
        features={[
            { icon: <Leaf size={24} />, title: "Plant Selection", desc: "Carefully chosen plants for beauty and low maintenance." },
            { icon: <Droplets size={24} />, title: "Irrigation Systems", desc: "Efficient watering systems to keep your garden thriving." },
            { icon: <Milestone size={24} />, title: "Hardscaping", desc: "Pathways, patios, and structures that complement nature." },
            { icon: <Moon size={24} />, title: "Outdoor Lighting", desc: "Landscape lighting for beautiful evenings outdoors." },
        ]}
        gallery={["/images/storage.jpg", "/images/image1.jpg", "/images/image2.jpg", "/images/accessories.jpg"]}
    />
);

export default GardenLandscape;