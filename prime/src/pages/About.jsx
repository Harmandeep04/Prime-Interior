import React, { useState, useEffect } from 'react';
import './css/About.css';
import { Package, RotateCcw, Headphones, BadgePercent, Combine, Feather, Layers, Star, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const About = () => {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5555/user/get-reviews')
            .then(res => { if (res.data.success) setReviews(res.data.body); })
            .catch(err => console.error('Reviews fetch error:', err));
    }, []);

    return (
        <div className="about-page">

            {/* ── Hero Banner ── */}
            <section className="about-hero-banner">
                <img src="/images/background_1.jpg" alt="About Prime Interior" />
                <div className="about-hero-overlay">
                    <h1>About Us</h1>
                    <p className="about-breadcrumb">Homepage &rsaquo; Pages &rsaquo; About Us</p>
                </div>
            </section>

            {/* ── Intro ── */}
            <section className="about-intro">
                <h2>We Are Prime Interior</h2>
                <p>
                    We create unique interior spaces that improve the way people live, work, and feel at home.
                    For more than 8 years, our co-founders have collaborated with the finest architects and 
                    designers to craft interiors renowned for their elegance, functionality, and 
                    uncompromising quality.
                </p>
            </section>

            {/* ── Full Width Image ── */}
            <section className="about-full-img">
                <img src="/images/about-wide.jpg" alt="Prime Interior Design" />
            </section>

            {/* ── Mission & Vision ── */}
            <section className="about-mv">
                <div className="about-mv-block">
                    <h2>Our Mission</h2>
                    <p>
                        To create inspiring spaces through thoughtful design, architectural precision, 
                        and deep client collaboration. Our mission is to uplift everyday living by 
                        transforming houses into homes — blending aesthetics with purpose at every step.
                    </p>
                </div>
                <div className="about-mv-block">
                    <h2>Our Vision</h2>
                    <p>
                        To be the most trusted name in interior design and architecture — building a 
                        legacy of beautiful, functional spaces that stand the test of time. Our vision 
                        is to make world-class design accessible to every home and every family.
                    </p>
                </div>
            </section>

            {/* ── Divider ── */}
            <div className="about-divider" />

            {/* ── Why Choose Us ── */}
            <section className="about-features">
                {[
                    { icon: <Package  size={44} strokeWidth={1.2} />, title: "End-to-End Service", desc: "From concept to completion — we handle everything."    },
                    { icon: <RotateCcw size={44} strokeWidth={1.2} />, title: "Flexible Revisions",  desc: "We refine until the design feels perfectly right."      },
                    { icon: <Headphones size={44} strokeWidth={1.2} />, title: "Dedicated Support",  desc: "Our team is always available for every question."       },
                    { icon: <BadgePercent size={44} strokeWidth={1.2} />, title: "Premium Quality",  desc: "Only the finest materials and craftsmanship."           },
                ].map((f, i) => (
                    <div className="about-feature-item" key={i}>
                        <div className="about-feature-icon">{f.icon}</div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                ))}
            </section>

            {/* ── Design DNA ── */}
            <section className="about-dna">
                <div className="about-dna-img">
                    <img src="/images/about-dna.jpg" alt="Design DNA" />
                </div>
                <div className="about-dna-content">
                    <h2>Prime Interior Design DNA</h2>
                    <p>
                        Our work reflects the values of craftsmanship, simplicity, and functionality 
                        that define our founding vision — spaces that feel as good as they look.
                    </p>
                    <div className="about-dna-points">
                        {[
                            { icon: <Combine  size={44} strokeWidth={1.2} />, title: "Form",          desc: "We consider every detail, giving our designs a feeling of pure precision and purposeful craft."  },
                            { icon: <Feather   size={44} strokeWidth={1.2} />, title: "Feel",          desc: "Irresistibly crafted. Our spaces are intuitively inviting and welcoming, appealing to the senses." },
                            { icon: <Layers    size={44} strokeWidth={1.2} />, title: "Functionality", desc: "Our designs are purposeful — carrying the tradition of design that values form as much as function."},
                        ].map((pt, i) => (
                            <div className="dna-point" key={i}>
                                <div className="dna-icon">{pt.icon}</div>
                                <div>
                                    <h4>{pt.title}</h4>
                                    <p>{pt.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Testimonials — backend reviews ── */}
            <section className="about-testimonials">
                <h2>What Our Clients Say!</h2>
                <p className="about-testi-sub">Our customers adore our products — and we constantly aim to delight them.</p>
                {reviews.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center', padding: '30px 0' }}>Loading reviews...</p>
                ) : (
                    <Swiper
                        modules={[Autoplay]}
                        loop
                        autoplay={{ delay: 0, disableOnInteraction: false }}
                        speed={4000}
                        slidesPerView={1}
                        spaceBetween={20}
                        breakpoints={{
                            640:  { slidesPerView: 1.5 },
                            768:  { slidesPerView: 2   },
                            1024: { slidesPerView: 3   },
                        }}
                        className="about-reviews-swiper"
                    >
                        {reviews.map((rev) => (
                            <SwiperSlide key={rev._id} style={{ height: 'auto', display: 'flex' }}>
                                <div className="testi-card">
                                    <div className="testi-stars-row">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14}
                                                fill={i < rev.rating ? '#f59e0b' : 'none'}
                                                color={i < rev.rating ? '#f59e0b' : '#ddd'} />
                                        ))}
                                    </div>
                                    <p>"{rev.comment}"</p>
                                    <div className="testi-footer">
                                        <img
                                            src={rev.productImg || '/images/placeholder-product.jpg'}
                                            alt={rev.productName}
                                            className="testi-product-img"
                                            onError={e => { e.target.style.display = 'none'; }}
                                        />
                                        <div>
                                            <div className="testi-name-row">
                                                <span className="testi-name">{rev.name}</span>
                                                <CheckCircle size={13} color="#22c55e" />
                                            </div>
                                            <span className="testi-product-name">{rev.productName || 'Product'}</span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </section>

        </div>
    );
};

export default About;