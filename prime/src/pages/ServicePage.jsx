import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Heart, Eye, Star, CheckCircle, X, Minus, Plus } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'swiper/css';
import './css/ServicePage.css';

import { useWishlist } from '../context/WishlistContext';
import { useCart }     from '../context/CartContext';

const BASE_URL = 'http://localhost:5555';

// ─────────────────────────────────────────────
// Quick View Modal
// ─────────────────────────────────────────────
const QuickViewModal = ({ product, onClose, onAddToCart, wishlistCtx }) => {
    const [color, setColor] = useState(product.colors?.[0] || '#c9b8a8');
    const [size,  setSize]  = useState('Size A - Small');
    const [qty,   setQty]   = useState(1);
    const [added, setAdded] = useState(false);
    const navigate          = useNavigate();
    const { addToCart }     = useCart();

    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    const handleAdd = () => {
        const isLoggedIn = !!localStorage.getItem('user');
        if (!isLoggedIn) { onClose(); navigate('/login'); return; }
        onAddToCart({ ...product, color, size, qty });
        setAdded(true);
        setTimeout(() => { setAdded(false); onClose(); }, 800);
    };

    const handleBuyNow = () => {
        const isLoggedIn = !!localStorage.getItem('user');
        if (!isLoggedIn) { onClose(); navigate('/login'); return; }
        addToCart({ ...product, color, size, qty });
        onClose();
        navigate('/shopping-cart');
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        const isLoggedIn = !!localStorage.getItem('user');
        if (!isLoggedIn) {
            toast.info('Please login first to add to wishlist! ❤️');
            onClose();
            navigate('/login');
            return;
        }
        wishlistCtx?.toggleWishlist(product);
    };

    const colors = product.colors?.length ? product.colors : ['#c9b8a8', '#888', '#555'];
    const liked  = wishlistCtx?.isWishlisted
        ? wishlistCtx.isWishlisted(product.id || product._id)
        : false;

    const colorNames = ['Beige', 'Grey', 'Dark'];

    return (
        <div className="hp-qv-overlay" onClick={onClose}>
            <div className="hp-qv-panel" onClick={e => e.stopPropagation()}>
                <button className="hp-qv-close" onClick={onClose}><X size={22} /></button>
                <div className="hp-qv-body">
                    <div className="hp-qv-images">
                        <img
                            src={product.img || product.image}
                            alt={product.name}
                            className="hp-qv-main"
                            onError={e => { e.target.src = 'https://via.placeholder.com/400'; }}
                        />
                        {(product.hoverImg || product.hoverImage) && (
                            <img
                                src={product.hoverImg || product.hoverImage}
                                alt=""
                                className="hp-qv-thumb"
                                onError={e => { e.target.src = 'https://via.placeholder.com/100'; }}
                            />
                        )}
                    </div>
                    <div className="hp-qv-info">
                        <p className="hp-qv-label">Quick View</p>
                        <h3>{product.name}</h3>
                        <div className="hp-qv-meta">
                            <div className="hp-qv-stars">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14}
                                        fill={i < 4 ? '#f5a623' : 'none'}
                                        color={i < 4 ? '#f5a623' : '#ddd'} />
                                ))}
                                <span>(134 reviews)</span>
                            </div>
                            <span className="hp-qv-sold">18 sold in last 32 hours</span>
                        </div>
                        <div className="hp-qv-price-row">
                            {product.discount ? (
                                <>
                                    <span className="hp-qv-old">
                                        ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                                    </span>
                                    <span className="hp-qv-price">${product.price}</span>
                                    <span className="hp-qv-disc">-{product.discount}%</span>
                                </>
                            ) : (
                                <span className="hp-qv-price">${product.price}</span>
                            )}
                        </div>
                        <p className="hp-qv-desc">
                            {product.description || 'Sustainable fibres, reducing environmental impact.'}
                        </p>
                        <p className="hp-qv-viewers"><Eye size={14} /> 28 people are viewing this right now</p>

                        <div className="hp-qv-section">
                            <p>Colors: <strong>{colorNames[colors.indexOf(color)] || 'Beige'}</strong></p>
                            <div className="hp-qv-colors">
                                {colors.map((c, i) => (
                                    <button key={i}
                                        className={`hp-qv-swatch ${color === c ? 'active' : ''}`}
                                        style={{ background: c }}
                                        onClick={() => setColor(c)} />
                                ))}
                            </div>
                        </div>

                        <div className="hp-qv-section">
                            <p>Size: <strong>{size}</strong></p>
                            <div className="hp-qv-sizes">
                                {['Size A - Small', 'Size B - Medium'].map(s => (
                                    <button key={s}
                                        className={`hp-qv-size-btn ${size === s ? 'active' : ''}`}
                                        onClick={() => setSize(s)}>{s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="hp-qv-section">
                            <p>Quantity:</p>
                            <div className="hp-qv-qty">
                                <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
                                <span>{qty}</span>
                                <button onClick={() => setQty(q => q + 1)}><Plus size={14} /></button>
                            </div>
                        </div>

                        <div className="hp-qv-actions">
                            <button className={`hp-qv-atc ${added ? 'added' : ''}`} onClick={handleAdd}>
                                {added ? `✓ Added  $${product.price}` : `Add To Cart  $${product.price}`}
                            </button>
                            <button className="hp-qv-icon-btn" onClick={handleWishlistClick}>
                                <Heart size={18}
                                    fill={liked ? '#e53e3e' : 'none'}
                                    color={liked ? '#e53e3e' : '#333'} />
                            </button>
                        </div>
                        <button className="hp-qv-buy-now" onClick={handleBuyNow}>Buy it now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
// ServicePage
// ─────────────────────────────────────────────
const ServicePage = ({
    title       = 'Our Service',
    subtitle    = 'Premium quality & design',
    description = 'We provide top‑notch interior solutions tailored to your needs.',
    features    = [],
    img         = '',
    gallery     = [],
    // ✅ serviceName — yahi MongoDB `servicePage` field naal match karda hai
    // e.g. "Living Room" | "Bedroom Design" | "Modular Kitchen" etc.
    // Agar pass nahi kita ta `title` use hoga fallback vajoh
    serviceName,
}) => {
    const navigate      = useNavigate();
    const { addToCart } = useCart();
    const wishlistCtx   = useWishlist();

    // ✅ Backend products state
    const [products,         setProducts]         = useState([]);
    const [productsLoading,  setProductsLoading]  = useState(true);
    const [reviews,          setReviews]          = useState([]);
    const [addedId,          setAddedId]          = useState(null);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    // ✅ servicePage filter key — serviceName prop pehle,
    //    nahin ta title (e.g. "Living Room Design" → still match "Living Room" if exact)
    const filterKey = serviceName || title;

    // ✅ Backend se products fetch + filter by servicePage
    useEffect(() => {
        setProductsLoading(true);
        axios.get(`${BASE_URL}/user/all-products`)
            .then(res => {
                if (res.data.success) {
                    const normalized = res.data.body.map(p => ({
                        ...p,
                        id:       p._id,
                        img:      p.image      || '',
                        hoverImg: p.hoverImage || '',
                        colors:   p.colors?.length ? p.colors : ['#c9b8a8', '#888', '#555'],
                        discount: p.discount   || 0,
                    }));

                    // ✅ Filter — sirf us service de products show karo
                    const filtered = normalized.filter(
                        p => p.servicePage === filterKey
                    );

                    // ✅ Agar koi product match nahi hoya ta saari products show karo
                    //    (fallback taaki page blank na dikhe)
                    setProducts(filtered.length > 0 ? filtered : normalized.slice(0, 8));
                }
            })
            .catch(err => {
                console.error('Products fetch error:', err);
                toast.error('Could not load products ❌');
            })
            .finally(() => setProductsLoading(false));
    }, [filterKey]);

    // Reviews fetch
    useEffect(() => {
        axios.get(`${BASE_URL}/user/get-reviews`)
            .then(res => { if (res.data.success) setReviews(res.data.body); })
            .catch(() => {});
    }, []);

    // ✅ Login check
    const isWishlisted = (id) => {
        if (!localStorage.getItem('user')) return false;
        return wishlistCtx?.isWishlisted ? wishlistCtx.isWishlisted(id) : false;
    };

    // ✅ Add to Cart
    const handleAddToCart = (product) => {
        const isLoggedIn = !!localStorage.getItem('user');
        if (!isLoggedIn) {
            toast.info('Please login first! 🛒');
            navigate('/login');
            return;
        }
        addToCart({ ...product, qty: product.qty || 1 });
        setAddedId(product.id || product._id);
        setTimeout(() => setAddedId(null), 1500);
    };

    // ✅ Wishlist toggle
    const handleWishlistToggle = (e, product) => {
        e.stopPropagation();
        const isLoggedIn = !!localStorage.getItem('user');
        if (!isLoggedIn) {
            toast.info('Please login first to add to wishlist! ❤️');
            navigate('/login');
            return;
        }
        wishlistCtx?.toggleWishlist(product);
    };

    // ── Product Card ──
    const ProductCard = ({ product, index }) => {
        const pid   = product.id || product._id;
        const liked = isWishlisted(pid);
        return (
            <motion.div
                className="product-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
            >
                <div className="product-img-container">
                    {product.discount > 0 && (
                        <span className="discount-tag">-{product.discount}%</span>
                    )}
                    <img
                        src={product.img || product.image}
                        alt={product.name}
                        className="main-image primary"
                        onError={e => { e.target.src = 'https://via.placeholder.com/300'; }}
                    />
                    {(product.hoverImg || product.hoverImage) && (
                        <img
                            src={product.hoverImg || product.hoverImage}
                            alt={product.name}
                            className="main-image secondary"
                            onError={e => { e.target.src = 'https://via.placeholder.com/300'; }}
                        />
                    )}

                    <div className="wishlist-icons-group">
                        <button
                            className={`option-icon-btn ${liked ? 'wishlisted' : ''}`}
                            onClick={(e) => handleWishlistToggle(e, product)}
                            title="Add to Wishlist"
                        >
                            <Heart size={16}
                                fill={liked ? '#e53e3e' : 'none'}
                                color={liked ? '#e53e3e' : '#333'} />
                        </button>
                        <button className="option-icon-btn" title="Quick View"
                            onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}>
                            <Eye size={16} />
                        </button>
                    </div>

                    <button
                        className={`atc-button-slide ${addedId === pid ? 'atc-added' : ''}`}
                        onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                    >
                        {addedId === pid ? '✓ Added!' : 'Add To Cart'}
                    </button>
                </div>

                <div className="product-details">
                    <h3 className="product-name-link">{product.name}</h3>
                    <div className="price-container">
                        {product.discount > 0 ? (
                            <>
                                <span className="old-price">
                                    ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                                </span>
                                <span className="product-price" style={{ marginLeft: 10 }}>
                                    ${product.price}
                                </span>
                            </>
                        ) : (
                            <span className="product-price">${product.price}</span>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="service-page">

            {/* ── HERO ── */}
            <section className="service-hero" style={{ backgroundImage: `url(${img})` }}>
                <div className="service-hero-overlay">
                    <p className="page-tag">PRIME INTERIOR</p>
                    <h1>{title}</h1>
                    <p>{subtitle}</p>
                    <button onClick={() => window.location.href = '/contact'}>
                        Get Free Quote ↗
                    </button>
                </div>
            </section>

            {/* ── ABOUT / FEATURES ── */}
            <section className="service-about">
                <div className="service-about-text">
                    <p className="page-tag">ABOUT THIS SERVICE</p>
                    <h2>Why Choose Prime Interior <br />For {title}?</h2>
                    <p>{description}</p>
                    <button onClick={() => window.location.href = '/contact'} className="service-cta-btn">
                        Book Consultation
                    </button>
                </div>
                <div className="service-features">
                    {features.map((f, i) => (
                        <div className="feature-item" key={i}>
                            <span>{f.icon}</span>
                            <div>
                                <h4>{f.title}</h4>
                                <p>{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── GALLERY ── */}
            {gallery.length > 0 && (
                <section className="service-gallery">
                    <p className="page-tag center">OUR WORK</p>
                    <h2 className="center">Recent {title} Projects</h2>
                    <div className="gallery-grid">
                        {gallery.map((src, i) => (
                            <div className="gallery-item" key={i}>
                                <img src={src} alt={`${title} ${i + 1}`}
                                    onError={e => {
                                        e.target.src = `https://via.placeholder.com/400x300?text=${title}`;
                                    }} />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── PRODUCTS ── */}
            <section className="sp-products-section">
                <motion.div
                    className="section-header"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.7 }}
                >
                    <h2>Shop Related Products</h2>
                    <p>Handpicked pieces perfect for your {title.toLowerCase()}.</p>
                </motion.div>

                {productsLoading ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                        Loading products...
                    </p>
                ) : products.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                        No products found.
                    </p>
                ) : (
                    <div className="product-grid">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product.id || product._id}
                                product={product}
                                index={index}
                            />
                        ))}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: 40 }}>
                    <button
                        className="sp-view-all-btn"
                        onClick={() => window.location.href = '/products'}
                    >
                        View All Products ↗
                    </button>
                </div>
            </section>

            {/* ── REVIEWS ── */}
            <section className="sp-reviews-section">
                <motion.div
                    className="section-title"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    style={{ textAlign: 'center', marginBottom: 30 }}
                >
                    <h2 style={{
                        fontFamily: 'Georgia, serif', fontWeight: 400,
                        fontSize: '2rem', marginBottom: 10
                    }}>
                        What Our Clients Say
                    </h2>
                    <p style={{ fontSize: '1.1rem', color: '#555' }}>
                        Our customers adore our products, and we constantly aim to delight them.
                    </p>
                </motion.div>

                {reviews.length > 0 ? (
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
                        className="reviews-swiper"
                    >
                        {reviews.map(rev => (
                            <SwiperSlide key={rev._id} style={{ height: 'auto', display: 'flex' }}>
    <div className="review-card" style={{ width: '100%', margin: '10px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
            <div className="card-header">
                <div className="user-info">
                    <h3>{rev.name}</h3>
                    <CheckCircle size={16} className="verified-icon" />
                    <span>Verified purchase</span>
                </div>
            </div>
            <div className="stars-row" style={{ margin: '10px 0' }}>
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14}
                        fill={i < rev.rating ? "#ffcc00" : "none"}
                        color={i < rev.rating ? "#ffcc00" : "#ddd"} />
                ))}
            </div>
            <p className="review-comment">"{rev.comment}"</p>
        </div>
    </div>
</SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <p style={{ textAlign: 'center', color: '#999' }}>
                        Loading fresh reviews…
                    </p>
                )}
            </section>

            {/* ── BOTTOM CTA ── */}
            <section className="service-bottom-cta">
                <h2>Interested In {title}?</h2>
                <p>Let's discuss your project today.</p>
                <div className="cta-buttons">
                    <button
                        onClick={() => window.location.href = '/contact'}
                        className="cta-btn-primary"
                    >
                        Get Free Quote
                    </button>
                    <button
                        onClick={() => window.location.href = '/portfolio'}
                        className="cta-btn-secondary"
                    >
                        View Portfolio
                    </button>
                </div>
            </section>

            {/* ── Quick View Modal ── */}
            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                    onAddToCart={handleAddToCart}
                    wishlistCtx={wishlistCtx}
                />
            )}
        </div>
    );
};

export default ServicePage;