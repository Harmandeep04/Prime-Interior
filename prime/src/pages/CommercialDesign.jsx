import React from 'react';
import { Building2, UtensilsCrossed, ShoppingBag, Hotel } from 'lucide-react';
import ServicePage from './ServicePage';

const CommercialDesign = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Commercial Design"
        subtitle="Professional spaces that inspire and impress"
        description="Your commercial space reflects your brand. We design offices, restaurants, retail stores, and hospitality spaces that make a powerful impression. Functional, beautiful, and on-brand every time."
        img="/images/decor-office.jpg"
        features={[
            { icon: <Building2 size={24} />, title: "Office Design", desc: "Productive workspaces that reflect your company culture." },
            { icon: <UtensilsCrossed size={24} />, title: "Restaurant Design", desc: "Dining spaces that enhance the culinary experience." },
            { icon: <ShoppingBag size={24} />, title: "Retail Design", desc: "Store layouts that maximize sales and customer experience." },
            { icon: <Hotel size={24} />, title: "Hospitality", desc: "Hotel and resort spaces that delight guests." },
        ]}
        gallery={["/images/decor-office.jpg", "/images/office-chair.jpg", "/images/lighting.jpg", "/images/image1.jpg"]}
    />
);

export default CommercialDesign;