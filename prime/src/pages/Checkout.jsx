import React, { useState, useEffect } from 'react';
import { ArrowUpRight, CreditCard, Truck, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/Checkout.css';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia'];
const STATES    = ['Punjab', 'Haryana', 'Maharashtra', 'Delhi', 'Karnataka'];
const BASE_URL  = 'https://prime-interior-backend.onrender.com';

const Checkout = () => {
    const navigate = useNavigate();
    
    const { clearCart } = useCart();
    
    // ✅ Logged-in user di email localStorage ton lo
    const getUserEmail = () => {
        const direct = localStorage.getItem('userEmail');
        if (direct && direct !== 'null' && direct !== 'undefined') return direct;
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            return user?.email || user?.data?.email || '';
        } catch { return ''; }
    };
    const userEmail = getUserEmail();

    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({
        firstName: '', lastName: '', email: userEmail, phone: '',
        country: 'India', city: '', street: '', state: '', postal: '', note: '',
    });

    const [payment, setPayment] = useState('cod');
    const [card, setCard]       = useState({ name: '', number: '', expiry: '', cvv: '' });
    const [voucher, setVoucher] = useState('');
    const [discount, setDiscount] = useState(0);
    const [voucherError, setVoucherError] = useState('');
    const [voucherSuccess, setVoucherSuccess] = useState('');
    const [agreed, setAgreed] = useState(false);

    // Fetch cart from localStorage
    useEffect(() => {
        const localCart = localStorage.getItem('checkoutCart');
        if (localCart) {
            try {
                const parsedCart = JSON.parse(localCart);
                const sanitizedCart = parsedCart.map(item => {
                    let numericId = item.id;
                    if (typeof item.id === 'string') {
                        const extractedNum = item.id.replace(/\D/g, '');
                        numericId = extractedNum ? Number(extractedNum) : Math.floor(Math.random() * 1000) + 1;
                    } else {
                        numericId = Number(item.id);
                    }
                    return {
                        id: numericId,
                        name: item.name,
                        price: Number(item.price),
                        qty: Number(item.qty),
                        img: item.img || ''
                    };
                });
                setCartItems(sanitizedCart);
            } catch (err) {
                console.error("Cart read error:", err);
            }
        }
        setLoading(false);
    }, []);

    // Sync cartItems back to localStorage whenever they change
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('checkoutCart', JSON.stringify(cartItems));
        }
    }, [cartItems, loading]);

    // Remove item from checkout summary
    const handleRemoveItem = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const handleField = (e) => {
        const { name, value } = e.target;
        setForm(prevForm => {
            let updatedForm = { ...prevForm, [name]: value };
            if (name === 'city') {
                const cleanCity = value.trim().toLowerCase();
                if (cleanCity === 'kalanwali') {
                    updatedForm.state  = 'Haryana';
                    updatedForm.postal = '125201';
                }
            }
            return updatedForm;
        });
    };

    const handleCard = (e) => setCard(p => ({ ...p, [e.target.name]: e.target.value }));

    const subtotal     = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const shippingCost = subtotal >= 150 ? 0 : 35;
    const total        = subtotal + shippingCost - discount;

    const handleApplyVoucher = async () => {
        if (!voucher.trim()) return;
        try {
            setVoucherError('');
            setVoucherSuccess('');
            const response = await axios.post(`${BASE_URL}/api/validate-voucher`, { code: voucher, subtotal });
            if (response.data.valid) {
                setDiscount(response.data.discountAmount);
                setVoucherSuccess(`Coupon applied! -$${response.data.discountAmount}`);
            } else {
                setDiscount(0);
                setVoucherError(response.data.message || 'Invalid Coupon Code');
            }
        } catch (error) {
            setDiscount(0);
            setVoucherError('Error validating coupon.');
        }
    };

    const handleSubmit = async () => {
        if (!agreed) {toast.error('Please agree to the Terms and Conditions.'); return; }
        if (cartItems.length === 0) { toast.error('Your cart is empty.'); return; }
        if (!form.firstName || !form.phone || !form.city || !form.state) {
            toast.error('Please fill out all required fields (*).');
            return;
        }

        const orderPayload = {
            email: form.email,
            shippingAddress: {
                firstName: form.firstName, lastName: form.lastName,
                phone: form.phone, country: form.country,
                city: form.city, street: form.street,
                state: form.state, postal: form.postal, note: form.note
            },
            items: cartItems.map(item => ({
                id: item.id, name: item.name,
                price: item.price, qty: item.qty, img: item.img
            })),
            paymentMethod: payment,
            summary: { subtotal, shippingCost, discount, total }
        };

        try {
            const response = await axios.post(`${BASE_URL}/api/orders`, orderPayload);
            if (response.data.success || response.status === 201) {
               toast.success('🎉 Order placed successfully! Check your email for more details.');
                localStorage.removeItem('checkoutCart');
                clearCart();
                navigate('/my-orders');
            } else {
                toast.error('Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error("Order error:", error.response?.data);
            toast.error(error.response?.data?.message || "Could not place order.");
        }
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Loading...</div>;

    return (
        <div className="co-page">
             {/* Hero */}
        <section className="co-hero">
            <img src="/images/background_1.jpg" alt="Checkout" />
            <div className="co-hero-overlay">
                <h1>Checkout</h1>
                <p className="co-breadcrumb">
                    <a href="/">Homepage</a> <span>›</span> Checkout
                </p>
            </div>
        </section>
            <div className="co-container">

                {/* ── LEFT ── */}
                <div className="co-left">
                    <section className="co-section">
                        <h2 className="co-section__title">Shipping Information</h2>
                        <div className="co-grid-2">
                            <input className="co-input" name="firstName" placeholder="First Name*"    value={form.firstName} onChange={handleField} />
                            <input className="co-input" name="lastName"  placeholder="Last Name*"     value={form.lastName}  onChange={handleField} />
                        </div>
                        <div className="co-grid-2">
                            <input className="co-input" name="email" value={form.email} disabled style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }} />
                            <input className="co-input" name="phone" placeholder="Phone Number*"      value={form.phone}     onChange={handleField} />
                        </div>
                        <select className="co-input co-select" name="country" value={form.country} onChange={handleField}>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <div className="co-grid-2">
                            <input className="co-input" name="city"   placeholder="Town/City*"        value={form.city}   onChange={handleField} />
                            <input className="co-input" name="street" placeholder="Street Address*"   value={form.street} onChange={handleField} />
                        </div>
                        <div className="co-grid-2">
                            <select className="co-input co-select" name="state" value={form.state} onChange={handleField}>
                                <option value="">Choose State</option>
                                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <input className="co-input" name="postal" placeholder="Postal Code*"      value={form.postal} onChange={handleField} />
                        </div>
                        <textarea className="co-input co-textarea" name="note" placeholder="Order notes (optional)..." value={form.note} onChange={handleField} />
                    </section>

                    <section className="co-section">
                        <h2 className="co-section__title">Payment Method</h2>

                        <div className={`co-payment-option ${payment === 'cod' ? 'co-payment-option--active' : ''}`}>
                            <label className="co-payment-label" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} />
                                <Truck size={16} /> <span>Cash on Delivery (COD)</span>
                            </label>
                        </div>

                        <div className={`co-payment-option ${payment === 'credit' ? 'co-payment-option--active' : ''}`}>
                            <label className="co-payment-label" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input type="radio" name="payment" value="credit" checked={payment === 'credit'} onChange={() => setPayment('credit')} />
                                <CreditCard size={16} /> <span>Credit Card</span>
                            </label>
                            {payment === 'credit' && (
                                <div className="co-card-fields" style={{ marginTop: '15px' }}>
                                    <input className="co-input" name="name"   placeholder="Cardholder Name*" value={card.name}   onChange={handleCard} />
                                    <input className="co-input" name="number" placeholder="Card Number*"      value={card.number} onChange={handleCard} />
                                    <div className="co-grid-2">
                                        <input className="co-input" name="expiry" placeholder="MM/YY*" value={card.expiry} onChange={handleCard} />
                                        <input className="co-input" name="cvv"    placeholder="CVV*"   value={card.cvv}    onChange={handleCard} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ margin: '20px 0' }}>
                            <label className="co-checkbox" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
                                <span>I agree to the Terms and Conditions</span>
                            </label>
                        </div>

                        <button className="co-pay-btn" onClick={handleSubmit} style={{ cursor: 'pointer' }}>
                            Place Order <ArrowUpRight size={16} />
                        </button>
                    </section>
                </div>

                {/* ── RIGHT: Order Summary ── */}
                <div className="co-right">
                    <div className="co-summary">
                        <h3>Order Summary</h3>

                        <div className="co-summary__items">
                            {cartItems.length === 0 ? (
                                <p style={{ color: '#888', padding: '10px 0' }}>Your cart is empty</p>
                            ) : (
                                cartItems.map(item => (
                                    <div key={item.id} className="co-summary__item" style={{
                                        display: 'flex', gap: '12px', marginBottom: '14px',
                                        alignItems: 'center', position: 'relative',
                                    }}>
                                        {/* Image */}
                                        <img
                                            src={item.img}
                                            alt={item.name}
                                            width="54" height="54"
                                            style={{ objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee', flexShrink: 0 }}
                                            onError={e => { e.target.src = 'https://via.placeholder.com/54'; }}
                                        />

                                        {/* Info */}
                                        <div className="co-summary__item-info" style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontWeight: '600', margin: '0 0 2px', fontSize: '13px', color: '#1a1a1a' }}>
                                                {item.name}
                                            </p>
                                            <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                                                {item.qty} x ${item.price.toFixed(2)}
                                            </p>
                                        </div>

                                        {/* Item total */}
                                        <span style={{ fontSize: '13px', fontWeight: '700', color: '#1a1a1a', whiteSpace: 'nowrap' }}>
                                            ${(item.price * item.qty).toFixed(2)}
                                        </span>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            title="Remove item"
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '3px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                color: '#bbb',
                                                borderRadius: '50%',
                                                transition: 'color 0.15s, background 0.15s',
                                                flexShrink: 0,
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.color = '#c0392b'; e.currentTarget.style.background = '#fff0f0'; }}
                                            onMouseLeave={e => { e.currentTarget.style.color = '#bbb';    e.currentTarget.style.background = 'none'; }}
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Voucher */}
                        <div className="co-voucher" style={{ marginTop: '16px' }}>
                            <input className="co-voucher__input" placeholder="Voucher Code" value={voucher} onChange={e => setVoucher(e.target.value)} />
                            <button className="co-voucher__btn" onClick={handleApplyVoucher}>Apply</button>
                        </div>
                        {voucherError   && <p style={{ color: 'red',   fontSize: '12px', marginTop: '5px' }}>{voucherError}</p>}
                        {voucherSuccess && <p style={{ color: 'green', fontSize: '12px', marginTop: '5px' }}>{voucherSuccess}</p>}

                        {/* Totals */}
                        <div className="co-summary__shipping" style={{ marginTop: '16px' }}>
                            <span>Shipping</span>
                            <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
                        </div>
                        <div className="co-summary__row">
                            <span>Discounts</span>
                            <span className="co-red">-${discount.toFixed(2)}</span>
                        </div>
                        <div className="co-summary__total">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;