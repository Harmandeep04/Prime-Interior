import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';  
import { toast } from 'react-toastify';
const FREE_SHIPPING_THRESHOLD = 150;

const CartSidebar = () => {  // ✅ No props needed - sab CartContext ton aanda hai
    const navigate = useNavigate();

    // ✅ CartContext ton sab kuch directly lo
    const {
        cartItems = [],
        cartOpen,
        setCartOpen,
        updateQty,
        removeItem,
    } = useCart();

    const isOpen  = cartOpen;
    const onClose = () => setCartOpen(false);

    const subtotal  = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const remaining = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
    const progress  = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

    // "View Cart" → save to localStorage → /shopping-cart
    const handleViewCart = () => {
        localStorage.setItem('checkoutCart', JSON.stringify(cartItems));
        onClose();
        navigate('/shopping-cart');
    };

    // "Check Out" → save to localStorage → /checkout
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            toast.error('Your cart is empty!');
            return;
        }
        localStorage.setItem('checkoutCart', JSON.stringify(cartItems));
        onClose();
        navigate('/checkout');
    };

    return (
        <>
            {/* ── Overlay ── */}
            <div
                className={`cart-overlay ${isOpen ? 'show' : ''}`}
                onClick={onClose}
                style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.4)',
                    zIndex: 998,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'all' : 'none',
                    transition: 'opacity 0.3s ease',
                }}
            />

            {/* ── Sidebar Panel ── */}
            <div
                className={`cart-sidebar ${isOpen ? 'open' : ''}`}
                style={{
                    position: 'fixed',
                    top: 0, right: 0, bottom: 0,
                    width: '420px',
                    maxWidth: '95vw',
                    background: '#fff',
                    zIndex: 999,
                    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '-4px 0 40px rgba(0,0,0,0.15)',
                }}
            >
                {/* ── Header ── */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', borderBottom: '1px solid #f0f0f0',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '-0.3px' }}>
                            Shopping Cart
                        </h3>
                        {cartItems.length > 0 && (
                            <span style={{
                                background: '#111', color: '#fff', borderRadius: '50px',
                                fontSize: '11px', fontWeight: 700,
                                padding: '2px 9px', letterSpacing: '0.3px',
                            }}>
                                {cartItems.reduce((s, i) => s + i.qty, 0)}
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} style={{
                        background: '#f5f5f5', border: 'none', cursor: 'pointer',
                        padding: '8px', borderRadius: '50%', display: 'flex',
                        alignItems: 'center', color: '#555', transition: 'background 0.2s',
                    }}>
                        <X size={18} />
                    </button>
                </div>

                {/* ── Free Shipping Progress ── */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
                    {remaining > 0 ? (
                        <p style={{ fontSize: '13px', color: '#555', marginBottom: '10px', margin: '0 0 10px' }}>
                            <strong style={{ color: '#222' }}>${remaining.toFixed(2)}</strong> more for{' '}
                            <strong style={{ color: '#2d6a4f' }}>FREE SHIPPING</strong>
                        </p>
                    ) : (
                        <p style={{ fontSize: '13px', color: '#2d6a4f', fontWeight: 600, margin: '0 0 10px' }}>
                            🎉 Congratulations! You've got free shipping!
                        </p>
                    )}
                    <div style={{ background: '#e8e8e8', borderRadius: '99px', height: '6px', position: 'relative' }}>
                        <div style={{
                            width: `${progress}%`, height: '100%', background: '#2d6a4f',
                            borderRadius: '99px', transition: 'width 0.5s ease',
                        }} />
                        <div style={{
                            position: 'absolute',
                            left: `${progress}%`,
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: '#2d6a4f',
                            borderRadius: '50%',
                            width: '22px', height: '22px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'left 0.5s ease',
                        }}>
                            <Truck size={11} color="#fff" />
                        </div>
                    </div>
                </div>

                {/* ── Cart Items ── */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '4px 0' }}>
                    {cartItems.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '70px 24px', color: '#aaa' }}>
                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
                            <p style={{ fontSize: '16px', fontWeight: 600, color: '#555', marginBottom: '8px' }}>
                                Your cart is empty
                            </p>
                            <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '24px' }}>
                                Add items to get started
                            </p>
                            <button onClick={onClose} style={{
                                padding: '12px 28px', background: '#111', color: '#fff',
                                border: 'none', borderRadius: '50px', cursor: 'pointer',
                                fontSize: '13px', fontWeight: 600, letterSpacing: '0.3px',
                            }}>
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        cartItems.map(item => (
                            <div key={item.id} style={{
                                display: 'flex', gap: '14px', padding: '16px 24px',
                                borderBottom: '1px solid #f5f5f5',
                                transition: 'background 0.2s',
                            }}>
                                {/* Product Image */}
                                <div style={{
                                    width: '76px', height: '76px', borderRadius: '10px',
                                    overflow: 'hidden', flexShrink: 0, background: '#f5f5f5',
                                }}>
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={e => { e.target.src = 'https://via.placeholder.com/76'; }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontSize: '13px', fontWeight: 600, marginBottom: '3px',
                                        color: '#111', lineHeight: '1.3',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    }}>
                                        {item.name}
                                    </p>
                                    <p style={{ fontSize: '12px', color: '#aaa', marginBottom: '10px' }}>
                                        {item.color || 'Gray'} · {item.size || 'Size C'}
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        {/* Qty Controls */}
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            border: '1.5px solid #e8e8e8', borderRadius: '50px',
                                            padding: '4px 12px',
                                        }}>
                                            <button
                                                onClick={() => updateQty(item.id, item.qty - 1)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', color: '#555' }}
                                            >
                                                <Minus size={12} />
                                            </button>
                                            <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                                                {item.qty}
                                            </span>
                                            <button
                                                onClick={() => updateQty(item.id, item.qty + 1)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex', color: '#555' }}
                                            >
                                                <Plus size={12} />
                                            </button>
                                        </div>
                                        {/* Price */}
                                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>
                                            ${(item.price * item.qty).toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => removeItem(item.id)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: '#ccc', fontSize: '11px', alignSelf: 'flex-start',
                                        padding: '2px', transition: 'color 0.2s',
                                        display: 'flex', alignItems: 'center',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = '#c0392b'}
                                    onMouseLeave={e => e.currentTarget.style.color = '#ccc'}
                                    title="Remove item"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* ── Footer ── */}
                {cartItems.length > 0 && (
                    <div style={{ padding: '20px 24px', borderTop: '1px solid #f0f0f0', background: '#fff' }}>

                        {/* Note / Shipping / Coupon Tabs */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
                            {[
                                { icon: '📝', label: 'Note' },
                                { icon: '🚚', label: 'Shipping' },
                                { icon: '🏷️', label: 'Coupon' },
                            ].map(tab => (
                                <button key={tab.label} style={{
                                    flex: 1, padding: '8px 4px',
                                    background: '#f8f8f8', border: '1.5px solid #ebebeb',
                                    borderRadius: '8px', fontSize: '11px', cursor: 'pointer',
                                    color: '#555', fontWeight: 500,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                                    transition: 'border-color 0.2s',
                                }}>
                                    {tab.icon} {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Subtotal */}
                        <div style={{
                            display: 'flex', justifyContent: 'space-between',
                            alignItems: 'center', marginBottom: '6px',
                        }}>
                            <span style={{ fontSize: '14px', color: '#888', fontWeight: 500 }}>Subtotal</span>
                            <span style={{ fontSize: '24px', fontWeight: 800, color: '#111', letterSpacing: '-0.5px' }}>
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>

                        <p style={{ fontSize: '11px', color: '#aaa', marginBottom: '14px', margin: '0 0 14px' }}>
                            Taxes and shipping calculated at checkout
                        </p>

                        {/* Terms */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                            <input type="checkbox" id="terms-check" defaultChecked style={{ cursor: 'pointer', accentColor: '#111' }} />
                            <label htmlFor="terms-check" style={{ fontSize: '11px', color: '#888', cursor: 'pointer' }}>
                                I agree with <span style={{ color: '#555', textDecoration: 'underline' }}>Terms & Conditions</span>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                            <button onClick={handleViewCart} style={{
                                flex: 1, padding: '13px', background: '#fff',
                                border: '2px solid #111', borderRadius: '50px',
                                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                color: '#111', transition: 'all 0.2s', letterSpacing: '0.3px',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
                            >
                                View Cart
                            </button>
                            <button onClick={handleCheckout} style={{
                                flex: 1.6, padding: '13px', background: '#111',
                                border: '2px solid #111', borderRadius: '50px',
                                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                                color: '#fff', transition: 'all 0.2s', letterSpacing: '0.3px',
                            }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#333'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#111'; }}
                            >
                                Check Out →
                            </button>
                        </div>

                        <p onClick={onClose} style={{
                            textAlign: 'center', fontSize: '12px', color: '#bbb',
                            cursor: 'pointer', margin: 0, transition: 'color 0.2s',
                            textDecoration: 'underline', textUnderlineOffset: '3px',
                        }}
                            onMouseEnter={e => e.currentTarget.style.color = '#888'}
                            onMouseLeave={e => e.currentTarget.style.color = '#bbb'}
                        >
                            Or continue shopping
                        </p>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;