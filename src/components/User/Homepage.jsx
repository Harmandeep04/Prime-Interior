import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { Heart, Eye, Star, CheckCircle, X, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import '../css/Homepage.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

// ─────────────────────────────────────────────
// Quick View Modal
// ─────────────────────────────────────────────
const QuickViewModal = ({ product, onClose, onAddToCart, wishlistCtx }) => {
    const [color, setColor] = useState(product.colors?.[0] || '#c9b8a8');
    const [size, setSize] = useState('Size A - Small');
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const navigate = useNavigate();
    const { addToCart } = useCart();

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
        const isLoggedIn = !!localStorage.getItem("user"); // ✅ Fixed
        if (!isLoggedIn) { onClose(); navigate('/login'); return; }
        onAddToCart({ ...product, color, size, qty });
        setAdded(true);
        setTimeout(() => { setAdded(false); onClose(); }, 800);
    };

    const handleBuyNow = () => {
        const isLoggedIn = !!localStorage.getItem("user"); // ✅ Fixed
        if (!isLoggedIn) { onClose(); navigate('/login'); return; }
        addToCart({ ...product, color, size, qty });
        onClose();
        navigate('/shopping-cart');
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        const isLoggedIn = !!localStorage.getItem("user"); // ✅ Fixed
        if (!isLoggedIn) {
            toast.info('Please login first to add to wishlist! ❤️');
            onClose();
            navigate('/login');
            return;
        }
        wishlistCtx?.toggleWishlist(product);
    };

    const colors = product.colors?.length ? product.colors : ['#c9b8a8', '#888', '#555'];
    const liked = wishlistCtx?.isWishlisted ? wishlistCtx.isWishlisted(product.id || product._id) : false;

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
                            {product.description || "Sustainable fibres, reducing environmental impact."}
                        </p>
                        <p className="hp-qv-viewers"><Eye size={14} /> 28 people are viewing this right now</p>

                        <div className="hp-qv-section">
                            <p>Colors: <strong>Beige</strong></p>
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
// Homepage
// ─────────────────────────────────────────────
const Homepage = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const wishlistCtx = useWishlist();

    const heroSlides = [
        { id: 1, title: "Ergonomic Duo Bundle", desc: "Perfect setup for your home office.", img: "/images/image1.jpg" },
        { id: 2, title: "Modern Office Chairs", desc: "Stay comfortable during long work hours.", img: "/images/image2.jpg" },
        { id: 3, title: "Executive Desk Setup", desc: "Premium desks for a professional look.", img: "/images/image1.jpg" },
    ];

    // ✅ State — backend products
    const [allProducts, setAllProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);

    const [reviews, setReviews] = useState([]);
    const [addedId, setAddedId] = useState(null);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    // ✅ Backend se products fetch karo
    useEffect(() => {
        axios.get("http://localhost:5555/user/all-products")
            .then(res => {
                if (res.data.success) {
                    // ✅ Backend data normalize karo — img/hoverImg consistent banao
                    const normalized = res.data.body.map(p => ({
                        ...p,
                        id: p._id,
                        img: p.image || "",
                        hoverImg: p.hoverImage || "",
                        colors: p.colors?.length ? p.colors : ['#c9b8a8', '#888', '#555'],
                        discount: p.discount || 0,
                    }));
                    setAllProducts(normalized);
                }
            })
            .catch(err => {
                console.error("Products fetch error:", err);
                toast.error("Could not load products ❌");
            })
            .finally(() => setProductsLoading(false));
    }, []);

    const products = allProducts.filter(p =>
        p.homepageSection === 'ourPicks' || p.homepageSection === 'both'
    );
    const topProducts = allProducts.filter(p =>
        p.homepageSection === 'topSeller' || p.homepageSection === 'both'
    );

    useEffect(() => {
        axios.get("http://localhost:5555/user/get-reviews")
            .then(res => { if (res.data.success) setReviews(res.data.body); })
            .catch(err => console.error("Reviews error:", err));
    }, []);

    const isWishlisted = (id) => {
        if (!localStorage.getItem("user")) return false; // ✅ Fixed
        return wishlistCtx?.isWishlisted ? wishlistCtx.isWishlisted(id) : false;
    };

    // ✅ Add to Cart — login check fixed
    const handleAddToCart = (product) => {
        const isLoggedIn = !!localStorage.getItem("user"); // ✅ Fixed
        if (!isLoggedIn) {
            toast.info('Please login first, then you can order! 🛒');
            navigate('/login');
            return;
        }
        addToCart({ ...product, qty: product.qty || 1 });
        setAddedId(product.id || product._id);
        setTimeout(() => setAddedId(null), 1500);
    };

    // ✅ Wishlist toggle — login check fixed
    const handleWishlistToggle = (e, product) => {
        e.stopPropagation();
        const isLoggedIn = !!localStorage.getItem("user"); // ✅ Fixed
        if (!isLoggedIn) {
            toast.info('Please login first to add to wishlist! ❤️');
            navigate('/login');
            return;
        }
        wishlistCtx?.toggleWishlist(product);
    };

    // ── Product Card ──
    const ProductCard = ({ product, index, showOldPrice = false }) => {
        const pid = product.id || product._id;
        const liked = isWishlisted(pid);
        return (
            <motion.div
                className="product-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
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
                        {(showOldPrice || product.discount > 0) && product.discount ? (
                            <>
                                <span className="old-price">
                                    ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                                </span>
                                <span className="product-price" style={{ marginLeft: '10px' }}>
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
        <div className="homepage">
            <main className="content-wrapper">

                {/* ── HERO ── */}
                <section className="hero-banner">
                    <div className="hero-swiper-wrapper">
                        <Swiper
                            modules={[Autoplay, Pagination]}
                            loop
                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                            pagination={{ clickable: true }}
                            centeredSlides
                            slidesPerView={1}
                            spaceBetween={0}
                            allowTouchMove={true}
                            className="hero-swiper-full"
                        >
                            {heroSlides.map(slide => (
                                <SwiperSlide key={slide.id}>
                                    <div className="hero-slide-full"
                                        style={{ backgroundImage: `url(${slide.img})` }}>
                                        <div className="hero-slide-overlay" />
                                        <div className="hero-slide-content">
                                            <h1 className="hero-slide-title">{slide.title}</h1>
                                            <p className="hero-slide-desc">{slide.desc}</p>
                                            <button className="hero-slide-btn"
                                                onClick={() => navigate('/products')}>
                                                Explore Collection ↗
                                            </button>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </section>

                {/* ── CATEGORIES ── */}
                <section className="categories-wrapper">
                    <div className="cat-grid">
                        {[
                            { id: 1, title: "Storage Solutions", img: "/images/storage.jpg" },
                            { id: 2, title: "Lighting", img: "/images/lighting.jpg" },
                            { id: 3, title: "Office Chairs", img: "/images/office-chair.jpg" },
                            { id: 4, title: "Accessories", img: "/images/accessories.jpg" },
                            { id: 5, title: "Decor Office", img: "/images/decor-office.jpg" },
                        ].map((cat, index) => (
                            <div key={cat.id} className={`cat-card card-${index + 1}`}>
                                <div className="cat-img-box">
                                    <img src={cat.img} alt={cat.title} />
                                </div>
                                <h2 className="cat-name">{cat.title}</h2>
                            </div>
                        ))}
                    </div>
                    <div className="view-all-center">
                        <a href="/products" className="view-all-text">View All Categories</a>
                    </div>
                </section>

                <div className="section-divider" />

                {/* ── OUR PICKS ── */}
                <section className="picks-section">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.8 }}
                        className="section-header"
                    >
                        <h2>Our Picks For You</h2>
                        <p>Fresh styles just in! Elevate your look.</p>
                    </motion.div>

                    {productsLoading ? (
                        <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                            Loading products...
                        </p>
                    ) : products.length > 0 ? (
                        <div className="product-grid">
                            {products.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                            No products found.
                        </p>
                    )}
                </section>

                {/* ── CURATED SPACES ── */}
                <section className="curated-section">
                    <div className="curated-container">
                        <div className="curated-image-box">
                            <img src="/images/banner-lookbook.jpg" alt="Curated Space"
                                className="main-setup-img" />
                            <div className="hotspot" style={{ top: '62%', left: '38%' }}>
                                <div className="hotspot-circle" />
                                <div className="hotspot-popup">
                                    <img src="/images/product-chair.jpg" alt="Chair" />
                                    <div className="popup-info">
                                        <h4>Ergonomic Chair Pro</h4><p>$79.99</p>
                                        <button className="hotspot-qv-btn" onClick={() =>
                                            setQuickViewProduct({
                                                id: 1, name: "Ergonomic Chair Pro", price: 79.99,
                                                img: "/images/product-chair(1.1).jpg",
                                                hoverImg: "/images/product-chair.jpg",
                                                discount: 25, colors: ['#c9b8a8', '#888', '#555']
                                            })
                                        }>Quick View</button>
                                    </div>
                                </div>
                            </div>
                            <div className="hotspot" style={{ top: '58%', left: '64%' }}>
                                <div className="hotspot-circle" />
                                <div className="hotspot-popup">
                                    <img src="/images/product-4.2.jpg" alt="Desk" />
                                    <div className="popup-info">
                                        <h4>Standing Desk</h4><p>$69.99</p>
                                        <button className="hotspot-qv-btn" onClick={() =>
                                            setQuickViewProduct({
                                                id: 4, name: "Double Standing Desk", price: 69.99,
                                                img: "/images/product-4.2.jpg",
                                                hoverImg: "/images/product-4.1.jpg",
                                                colors: ['#888']
                                            })
                                        }>Quick View</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="curated-text-side">
                            <h2 className="curated-title">Start With These Curated Spaces</h2>
                            <p className="curated-desc">Comfort and style meet to blissful perfection</p>
                            <div className="mini-product-card">
                                <div className="mini-img-box">
                                    <img src="/images/product-chair(1.1).jpg" alt="Featured" />
                                </div>
                                <div className="mini-info">
                                    <h4>Ergonomic Chair Pro</h4><p>$79.99</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── TOP SELLERS ── */}
                <section className="top-sellers-section">
                    <motion.div
                        className="section-header-row"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="header-text">
                            <h2>Shop Top Sellers</h2>
                            <p>Fresh styles just in!</p>
                        </div>
                        <a href="/products" className="view-all-link">View All Products</a>
                    </motion.div>

                    {productsLoading ? (
                        <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                            Loading products...
                        </p>
                    ) : topProducts.length > 0 ? (
                        <div className="product-grid">
                            {topProducts.map((product, index) => (
                                <ProductCard key={product.id} product={product}
                                    index={index} showOldPrice={true} />
                            ))}
                        </div>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#999', padding: '40px 0' }}>
                            No top sellers found.
                        </p>
                    )}
                </section>

                {/* ── REVIEWS ── */}
                <section className="reviews-section"
                    style={{ padding: '60px 5%', overflow: 'hidden' }}>
                    <motion.div className="section-title"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <p style={{ fontSize: '1.2rem', color: '#555' }}>
                            Our customers adore our products.
                        </p>
                    </motion.div>
                    {reviews.length > 0 ? (
                        <Swiper modules={[Autoplay]} loop
                            autoplay={{ delay: 0, disableOnInteraction: false }}
                            speed={4000} slidesPerView={1} spaceBetween={20}
                            breakpoints={{
                                640: { slidesPerView: 1.5 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            className="reviews-swiper">
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
                            Loading fresh reviews...
                        </p>
                    )}
                </section>

            </main>

            {/* Quick View Modal */}
            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                    onAddToCart={handleAddToCart}
                    wishlistCtx={wishlistCtx}
                />
            )}

            <style>{`
                .hero-swiper-wrapper{width:100%;padding:24px 16px;background:#fdf9f6;box-sizing:border-box}
                .hero-swiper-full{width:100%;border-radius:24px;overflow:hidden;box-shadow:0 8px 40px rgba(0,0,0,.15)}
                .hero-slide-full{width:100%;height:560px;background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center;position:relative}
                .hero-slide-overlay{position:absolute;inset:0;background:rgba(0,0,0,.32)}
                .hero-slide-content{position:relative;z-index:2;text-align:center;max-width:640px;padding:0 24px}
                .hero-slide-title{font-size:clamp(2rem,5vw,3.8rem);font-weight:700;color:#fff;margin:0 0 16px;line-height:1.15;text-shadow:0 2px 12px rgba(0,0,0,.3)}
                .hero-slide-desc{font-size:clamp(1rem,2vw,1.2rem);color:rgba(255,255,255,.88);margin:0 0 32px;font-weight:300;line-height:1.6}
                .hero-slide-btn{background:#fff;color:#111;border:none;padding:14px 34px;border-radius:999px;font-size:15px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:6px;box-shadow:0 4px 20px rgba(0,0,0,.18);transition:background .25s,color .25s,transform .2s}
                .hero-slide-btn:hover{background:#111;color:#fff;transform:scale(1.04)}
                .hero-swiper-full .swiper-pagination-bullet{background:rgba(255,255,255,.55)!important;opacity:1;width:8px;height:8px}
                .hero-swiper-full .swiper-pagination-bullet-active{background:#fff!important;width:28px!important;border-radius:5px!important}
                .option-icon-btn.wishlisted svg{fill:#e53e3e!important;color:#e53e3e!important}
                @media(max-width:768px){.hero-slide-full{height:400px}}
                @media(max-width:480px){.hero-slide-full{height:320px}.hero-swiper-wrapper{padding:12px 10px}}
            `}</style>
        </div>
    );
};

export default Homepage;