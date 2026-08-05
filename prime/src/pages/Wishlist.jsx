import React, { useContext, useEffect, useState } from 'react';
import { Heart, Eye, Star, X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { WishlistContext } from '../context/WishlistContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import './css/Wishlist.css';

// ─────────────────────────────────────────────
// Quick View Modal — same as Homepage
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
        const isLoggedIn = !!localStorage.getItem("user");
        if (!isLoggedIn) { onClose(); navigate('/login'); return; }
        onAddToCart({ ...product, color, size, qty });
        setAdded(true);
        setTimeout(() => { setAdded(false); onClose(); }, 800);
    };

    const handleBuyNow = () => {
        const isLoggedIn = !!localStorage.getItem("user");
        if (!isLoggedIn) { onClose(); navigate('/login'); return; }
        addToCart({ ...product, color, size, qty });
        onClose();
        navigate('/shopping-cart');
    };

    const handleWishlistClick = (e) => {
        e.stopPropagation();
        const isLoggedIn = !!localStorage.getItem("user");
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
// Wishlist Page
// ─────────────────────────────────────────────
const Wishlist = () => {
    const wishlistCtx = useContext(WishlistContext);
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const items = wishlistCtx?.wishlistItems || [];
    const loading = wishlistCtx?.loading || false;
    const isLoggedIn = !!localStorage.getItem("user");

    const [addedId, setAddedId] = useState(null);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    useEffect(() => {
        if (!isLoggedIn && !loading) {
            toast.warn("Please login to view your wishlist!", { toastId: "login-warning-toast" });
            navigate('/login');
        }
    }, [isLoggedIn, loading, navigate]);

    const handleAddToCart = (product) => {
        if (!isLoggedIn) {
            toast.info('Please login first! 🛒');
            navigate('/login');
            return;
        }
        addToCart({ ...product, qty: product.qty || 1 });
        const pid = product.id || product._id;
        setAddedId(pid);
        setTimeout(() => setAddedId(null), 1500);
        toast.success('Added to cart! 🛒');
    };

    const handleWishlistToggle = (e, product) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            toast.info('Please login first! ❤️');
            navigate('/login');
            return;
        }
        wishlistCtx?.toggleWishlist(product);
    };

    if (loading) {
        return (
            <div className="wl-loading">
                Loading your wishlist...
            </div>
        );
    }

    return (
        <div className="wl-container">

            {/* ── Header Banner ── */}
            <div className="wl-header-banner">
                <div className="wl-header-overlay" />
                <div className="wl-header-content">
                    <h1>YOUR DESIGN WISHLIST</h1>
                    <p>Curated premium concepts reserved exclusively for your space projects</p>
                </div>
            </div>

            {/* ── Body ── */}
            <div className="wl-body">

                {items.length === 0 ? (
                    <div className="wl-empty">
                        <Heart size={48} color="#ddd" />
                        <p>Your wishlist is empty</p>
                        <Link to="/" className="wl-shop-btn">Start Shopping</Link>
                    </div>
                ) : (
                    <>
                        <div className="wl-count-row">
                            <span className="wl-count">{items.length} item{items.length !== 1 ? 's' : ''} saved</span>
                            <Link to="/products" className="wl-browse-link">Browse More Products →</Link>
                        </div>

                        {/* ── Product Grid — same as Homepage ── */}
                        <div className="product-grid">
                            {items.map((product, index) => {
                                const pid = product.id || product._id || String(Math.random());
                                const liked = wishlistCtx?.isWishlisted ? wishlistCtx.isWishlisted(pid) : true;

                                return (
                                    <motion.div
                                        key={pid}
                                        className="product-card"
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.08, duration: 0.45 }}
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
                                                    title="Remove from Wishlist"
                                                >
                                                    <Heart size={16}
                                                        fill={liked ? '#e53e3e' : 'none'}
                                                        color={liked ? '#e53e3e' : '#333'} />
                                                </button>
                                                <button
                                                    className="option-icon-btn"
                                                    title="Quick View"
                                                    onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                                                >
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
                            })}
                        </div>
                    </>
                )}
            </div>

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

export default Wishlist;