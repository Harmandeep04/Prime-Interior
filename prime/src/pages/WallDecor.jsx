import React from 'react';
import { Image, ScrollText, PaintBucket, Brush } from 'lucide-react';
import ServicePage from './ServicePage';

const WallDecor = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Wall Decor"
        subtitle="Transform blank walls into stunning focal points"
        description="Walls are your canvas. From statement wallpapers to curated art collections, textured finishes to custom murals — we transform blank walls into beautiful focal points that define the character of your space."
        img="/images/accessories.jpg"
        features={[
            { icon: <Image size={24} />, title: "Art Curation", desc: "Carefully selected artwork for your walls." },
            { icon: <ScrollText size={24} />, title: "Wallpapers", desc: "Premium wallpapers from global designers." },
            { icon: <PaintBucket size={24} />, title: "Textured Finishes", desc: "Venetian plaster, wood panels, and more." },
            { icon: <Brush size={24} />, title: "Custom Murals", desc: "Bespoke wall art created just for you." },
        ]}
        gallery={["/images/accessories.jpg", "/images/image1.jpg", "/images/image2.jpg", "/images/lighting.jpg"]}
    />
);

export default WallDecor;