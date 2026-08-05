import React, { useState, useEffect } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './css/ShoppingCart.css';

const FREE_SHIPPING_THRESHOLD = 150;

const alsoBoughtProducts = [
    { id: 101, name: "Open Box - Adjustable Laptop Stand", price: 60.00, img: "/images/product-chair(1.1).jpg" },
    { id: 102, name: "Ergonomic Chair Pro",                price: 60.00, img: "/images/product-2.1.jpg" },
];

const interestedProducts = [
    { id: 201, name: "Ergonomic Chair Pro",               price: 79.99, img: "/images/product-chair(1.1).jpg", hoverImg: "/images/product-chair.jpg",   discount: null },
    { id: 202, name: "Open Box - Adjustable Laptop Stand",price: 79.99, originalPrice: 98.00, img: "/images/product-2.1.jpg", hoverImg: "/images/product-2.2.jpg", discount: 25 },
    { id: 203, name: "Laptop Stand",                      price: 89.99, originalPrice: 98.00, img: "/images/product-3.2.jpg", hoverImg: "/images/product-3.1.jpg", discount: 25 },
    { id: 204, name: "Double Standing Desk",              price: 69.99, img: "/images/product-4.2.jpg", hoverImg: "/images/product-4.1.jpg", discount: null },
];

const ShoppingCart = () => {
    const navigate  = useNavigate();
    const { cartItems, updateQty, removeItem, addToCart } = useCart();

    const [timeLeft,         setTimeLeft]         = useState(10 * 60);
    const [shipping,         setShipping]         = useState('free');
    const [addedIds,         setAddedIds]         = useState({});
    const [hoveredProductId, setHoveredProductId] = useState(null);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (s) => {
        if (s <= 0) return "Time's up!";
        const m = Math.floor(s / 60);
        return `${m}:${(s % 60).toString().padStart(2, '0')}`;
    };

    const subtotal    = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
    const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : (shipping === 'free' ? 0 : 35);
    const total       = subtotal + shippingCost;
    const progress    = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
    const remaining   = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);

    const handleQuickAdd = (product) => {
        const isLoggedIn = !!localStorage.getItem("userEmail");
        if (!isLoggedIn) { navigate('/login'); return; }
        addToCart({ ...product, qty: 1 });
        setAddedIds(prev => ({ ...prev, [product.id]: true }));
        setTimeout(() => setAddedIds(prev => ({ ...prev, [product.id]: false })), 1500);
    };

    const handleCheckout = () => {
        if (cartItems.length === 0) { alert("Your cart is empty!"); return; }
        if (!localStorage.getItem("userEmail")) { navigate('/login'); return; }
        localStorage.setItem('checkoutCart', JSON.stringify(cartItems));
        navigate('/checkout');
    };

    const firstItemName = cartItems.length > 0 ? cartItems[0].name : 'your item';

    return (
        <div className="sc-page">

            {/* Hero */}
            <section className="sc-hero">
                <img src="/images/background_2.jpg" alt="Shopping Cart" />
                <div className="sc-hero-overlay">
                    <h1>Shopping Cart</h1>
                    <p className="sc-breadcrumb">
                        <a href="/">Homepage</a> <span>›</span> Shopping Cart
                    </p>
                </div>
            </section>

            <div className="sc-body">

                {/* ── LEFT ── */}
                <div className="sc-left">

                    {cartItems.length > 0 && (
                        <div className="sc-timer-banner">
                            🔥 Your cart will expire in{' '}
                            <strong style={{ color: '#e53e3e' }}>{formatTime(timeLeft)}</strong>
                            {' '}minutes! Please checkout now!
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="sc-shipping-progress">
                            {remaining > 0 ? (
                                <p>Buy <span className="sc-amount">${remaining.toFixed(2)}</span> more to get <span className="sc-free">FREE SHIPPING</span></p>
                            ) : (
                                <p className="sc-congrats">🎉 You've got free shipping!</p>
                            )}
                            <div className="sc-bar-track">
                                <div className="sc-bar-fill" style={{ width: `${progress}%` }} />
                                <div className="sc-bar-truck" style={{ left: `${progress}%` }}>🚚</div>
                            </div>
                        </div>
                    )}

                    {cartItems.length > 0 && (
                        <div className="sc-table-header">
                            <span>Products</span>
                            <span>Price</span>
                            <span>Quantity</span>
                            <span>Total Price</span>
                            <span></span>
                        </div>
                    )}

                    {cartItems.length === 0 ? (
                        <div className="sc-empty">
                            <p>Your cart is empty</p>
                            <a href="/" className="sc-shop-btn">Continue Shopping</a>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div className="sc-row" key={item.id}>
                                <div className="sc-product-cell">
                                    <div className="sc-img">
                                        <img src={item.img} alt={item.name}
                                            onError={e => { e.target.src = 'https://via.placeholder.com/80'; }} />
                                    </div>
                                    <div className="sc-product-info">
                                        <h4>{item.name}</h4>
                                        <p>{item.color || 'Gray'}, {item.size || 'Size C'}</p>
                                    </div>
                                </div>
                                <div className="sc-price-cell">${item.price.toFixed(2)}</div>
                                <div className="sc-qty-cell">
                                    <div className="sc-qty-ctrl">
                                        <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={14} /></button>
                                        <span>{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={14} /></button>
                                    </div>
                                </div>
                                <div className="sc-total-cell">${(item.price * item.qty).toFixed(2)}</div>
                                <div className="sc-remove-cell">
                                    <button className="sc-remove-btn" onClick={() => removeItem(item.id)}>
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}

                    {cartItems.length > 0 && (
                        <div className="sc-also-bought">
                            <h2 className="sc-also-title">Customers also bought with "{firstItemName}"</h2>
                            <p className="sc-also-discount">
                                <span className="sc-also-badge">🏷️</span>
                                You will get <strong style={{ color: '#e53e3e' }}>10% OFF</strong> on each product
                            </p>
                            <div className="sc-also-grid">
                                {alsoBoughtProducts.map(product => (
                                    <div key={product.id} className="sc-also-card">
                                        <div className="sc-also-img">
                                            <img src={product.img} alt={product.name}
                                                onError={e => { e.target.src = 'https://via.placeholder.com/80'; }} />
                                        </div>
                                        <div className="sc-also-info">
                                            <p className="sc-also-name">{product.name}</p>
                                            <p className="sc-also-price">${product.price.toFixed(2)}</p>
                                            <button
                                                className={`sc-also-add ${addedIds[product.id] ? 'added' : ''}`}
                                                onClick={() => handleQuickAdd(product)}
                                            >
                                                {addedIds[product.id] ? '✓ Added' : 'Add'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* You may be interested in */}
                    <section className="top-sellers-section">
                        <div className="section-header-row">
                            <div className="header-text">
                                <h2>You may be interested in...</h2>
                                <p>Fresh styles just in! Elevate your look.</p>
                            </div>
                            <a href="/products" className="view-all-link">View All Products</a>
                        </div>
                        <div className="product-grid">
                            {interestedProducts.map(product => (
                                <div
                                    className="product-card"
                                    key={product.id}
                                    onMouseEnter={() => setHoveredProductId(product.id)}
                                    onMouseLeave={() => setHoveredProductId(null)}
                                >
                                    <div className="product-img-container">
                                        {product.discount && <span className="discount-tag">-{product.discount}%</span>}
                                        <img
                                            src={hoveredProductId === product.id && product.hoverImg ? product.hoverImg : product.img}
                                            alt={product.name}
                                            className="main-image"
                                            onError={e => { e.target.src = 'https://via.placeholder.com/200'; }}
                                        />
                                        <button
                                            className={`atc-button-slide ${addedIds[product.id] ? 'atc-added' : ''}`}
                                            onClick={() => handleQuickAdd(product)}
                                        >
                                            {addedIds[product.id] ? '✓ Added!' : 'Add To Cart'}
                                        </button>
                                    </div>
                                    <div className="product-details">
                                        <h3 className="product-name-link">{product.name}</h3>
                                        <div className="price-container">
                                            {product.originalPrice && (
                                                <span className="old-price">${product.originalPrice.toFixed(2)}</span>
                                            )}
                                            <span className="product-price">${product.price.toFixed(2)}</span>
                                        </div>
                                        <div className="color-swatches">
                                            <span className="swatch active-swatch" style={{ background: '#c5c9d6' }} />
                                            <span className="swatch" style={{ background: '#ececec' }} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ── RIGHT: Order Summary ── */}
                {cartItems.length > 0 && (
                    <div className="sc-right">
                        <div className="sc-summary">
                            <h2>Order Summary</h2>
                            <div className="sc-summary-row">
                                <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="sc-summary-row">
                                <span>Discounts</span><span>-$0.00</span>
                            </div>
                            <div className="sc-summary-shipping">
                                <span>Shipping</span>
                                <div className="sc-shipping-options">
                                    <label>
                                        <input type="radio" name="shipping" value="free"
                                            checked={shipping === 'free'} onChange={() => setShipping('free')} />
                                        Free Shipping <strong>$0.00</strong>
                                    </label>
                                    <label>
                                        <input type="radio" name="shipping" value="local"
                                            checked={shipping === 'local'} onChange={() => setShipping('local')} />
                                        Local: <strong>$35.00</strong>
                                    </label>
                                    <label>
                                        <input type="radio" name="shipping" value="flat"
                                            checked={shipping === 'flat'} onChange={() => setShipping('flat')} />
                                        Flat Rate: <strong>$35.00</strong>
                                    </label>
                                </div>
                            </div>
                            <div className="sc-summary-total">
                                <span>Total</span><strong>${total.toFixed(2)}</strong>
                            </div>
                            <label className="sc-terms-check">
                                <input type="checkbox" /> I agree with the{' '}
                                <button type="button" className="sc-terms-link">Terms And Conditions</button>
                            </label>
                            <button onClick={handleCheckout} className="sc-checkout-btn">
                                Process To Checkout ↗
                            </button>
                            <a href="/" className="sc-continue-link">Or continue shopping</a>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingCart;