import React from 'react';
import { ClipboardList, HardHat, Clock, BadgeDollarSign } from 'lucide-react';
import ServicePage from './ServicePage';

const FullRenovation = ({ onAddToCart }) => (
    <ServicePage
        onAddToCart={onAddToCart}
        title="Full Home Renovation"
        subtitle="Complete transformation of your entire living space"
        description="Ready for a complete home makeover? We manage the entire renovation process from planning to execution. Our experienced team coordinates all trades and ensures a seamless, stress-free renovation experience."
        img="/images/banner-lookbook.jpg"
        features={[
            { icon: <ClipboardList size={24} />, title: "Project Management", desc: "End-to-end project management for stress-free renovation." },
            { icon: <HardHat size={24} />, title: "Skilled Contractors", desc: "Experienced craftsmen for quality workmanship." },
            { icon: <Clock size={24} />, title: "On-Time Delivery", desc: "We respect your timeline and deliver on schedule." },
            { icon: <BadgeDollarSign size={24} />, title: "Budget Control", desc: "Transparent pricing with no hidden surprises." },
        ]}
        gallery={["/images/banner-lookbook.jpg", "/images/image1.jpg", "/images/image2.jpg", "/images/decor-office.jpg"]}
    />
);

export default FullRenovation;