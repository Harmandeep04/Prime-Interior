"use client";
import React, { useState, useEffect } from "react";
import "./Hero.css";

export const Hero = () => {
  const [current, setCurrent] = useState(0);

  const heroSlides = [
    {
      id: 1,
      title: "Ergonomic Duo Bundle",
      desc: "Perfect setup for your home office with our premium bundles.",
      img: "/images/pexels-leah-newhouse-50725-6480707.jpg",
    },
    {
      id: 2,
      title: "Modern Office Chairs",
      desc: "Stay comfortable during long work hours with our Pro series.",
      img: "/images/pexels-charlotte-may-5825527.jpg",
    },
    {
      id: 3,
      title: "Executive Desk Setup",
      desc: "Premium desks for a professional look.",
      img: "/images/pexels-vlada-karpovich-4050318.jpg",
    },
  ];

  // Auto scroll right to left
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-wrapper">
      <div className="hero-slider">
        <div
          className="hero-track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {heroSlides.map((slide) => (
            <div
              key={slide.id}
              className="hero-slide-item"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div className="hero-content">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-desc">{slide.desc}</p>
                <button className="hero-btn">Explore Collection ↗</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <span
              key={i}
              className={`hero-dot ${i === current ? "active" : ""}`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Hero;