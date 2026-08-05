import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, ChevronDown, ChevronUp, ShoppingBag, ArrowLeft, Clock, CheckCircle, Truck, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import '../css/MyOrders.css';

const BASE_URL = 'http://localhost:5555';

const STATUS_CONFIG = {
    pending:   { label: 'Pending',   color: '#f59e0b', bg: '#fffbeb', Icon: Clock       },
    confirmed: { label: 'Confirmed', color: '#3b82f6', bg: '#eff6ff', Icon: CheckCircle },
    shipped:   { label: 'Shipped',   color: '#8b5cf6', bg: '#f5f3ff', Icon: Truck       },
    delivered: { label: 'Delivered', color: '#10b981', bg: '#ecfdf5', Icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fef2f2', Icon: XCircle     },
};

const CANCELLABLE_STATUSES = ['pending', 'confirmed'];

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status?.toLowerCase()] || STATUS_CONFIG.pending;
    const { Icon } = cfg;
    return (
        <span className="mo-badge" style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.color}22` }}>
            <Icon size={12} /> {cfg.label}
        </span>
    );
};

// ── Custom Confirm Modal ──
const ConfirmModal = ({ onConfirm, onClose }) => (
    <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
        <div style={{
            background: '#fff', borderRadius: 16, padding: '32px 28px',
            maxWidth: 380, width: '90%', boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
            textAlign: 'center',
        }}>
            <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: '#fef2f2', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
            }}>
                <AlertTriangle size={26} color="#ef4444" />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem', fontWeight: 600, color: '#111' }}>
                Cancel Order?
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
                Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                    onClick={onClose}
                    style={{
                        flex: 1, padding: '10px 0', borderRadius: 8,
                        border: '1.5px solid #e5e5e5', background: '#fff',
                        color: '#555', fontSize: '0.9rem', fontWeight: 500,
                        cursor: 'pointer',
                    }}
                >
                    Keep Order
                </button>
                <button
                    onClick={onConfirm}
                    style={{
                        flex: 1, padding: '10px 0', borderRadius: 8,
                        border: 'none', background: '#ef4444',
                        color: '#fff', fontSize: '0.9rem', fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    Yes, Cancel
                </button>
            </div>
        </div>
    </div>
);

const MyOrders = () => {
    const navigate = useNavigate();
    const [user,         setUser]         = useState(null);
    const [orders,       setOrders]       = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [error,        setError]        = useState('');
    const [expanded,     setExpanded]     = useState({});
    const [cancellingId, setCancellingId] = useState(null);
    const [confirmId,    setConfirmId]    = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem('user');
        if (!saved) { navigate('/login'); return; }
        try { setUser(JSON.parse(saved)); }
        catch { navigate('/login'); }
    }, [navigate]);

    useEffect(() => {
        if (!user?.email) return;
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError('');
                const res = await axios.get(`${BASE_URL}/api/orders/my`, {
                    params: { email: user.email }
                });
                setOrders(res.data.orders || []);
            } catch (err) {
                console.error('Orders fetch error:', err);
                setError('Could not load your orders. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    // ✅ FIXED: removed res.data.success check — directly update state on 200
    const handleCancelOrder = async (orderId) => {
        setConfirmId(null);
        try {
            setCancellingId(orderId);
            await axios.put(`${BASE_URL}/api/orders/${orderId}/cancel`, {
                email: user.email?.trim().toLowerCase()
            });
            setOrders(prev =>
                prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o)
            );
            toast.success('Order cancelled! Confirmation email sent. 📧');
        } catch (err) {
            const msg = err.response?.data?.message || 'Server error. Please try again.';
            toast.error(`❌ ${msg}`);
        } finally {
            setCancellingId(null);
        }
    };

    const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit', month: 'short', year: 'numeric'
        });
    };

    const getEstimatedDelivery = (dateStr) => {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        const from = new Date(date); from.setDate(from.getDate() + 5);
        const to   = new Date(date); to.setDate(to.getDate() + 7);
        const opts = { day: '2-digit', month: 'short' };
        return `${from.toLocaleDateString('en-IN', opts)} – ${to.toLocaleDateString('en-IN', opts)}`;
    };

    if (loading) return (
        <div className="mo-page">
            <div className="mo-loading">
                <div className="mo-spinner" />
                <p>Loading your orders...</p>
            </div>
        </div>
    );

    return (
        <div className="mo-page">
            <div className="mo-container">

                <div className="mo-header">
                    <div className="mo-header-left">
                        <Package size={28} className="mo-header-icon" />
                        <div>
                            <h1>My Orders</h1>
                            <p>{user?.firstName ? `Hello, ${user.firstName}!` : 'Hello!'} Here are all your orders.</p>
                        </div>
                    </div>
                    <button className="mo-back-btn" onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} /> Back
                    </button>
                </div>

                {error && (
                    <div className="mo-error">
                        <XCircle size={18} /> {error}
                    </div>
                )}

                {!error && orders.length === 0 && (
                    <div className="mo-empty">
                        <ShoppingBag size={64} className="mo-empty-icon" />
                        <h2>No orders yet</h2>
                        <p>You haven't placed any orders yet. Start shopping!</p>
                        <button className="mo-shop-btn" onClick={() => navigate('/')}>Browse Products</button>
                    </div>
                )}

                {orders.length > 0 && (
                    <div className="mo-list">
                        {orders.map((order, idx) => {
                            const isOpen    = expanded[order._id || idx];
                            const addr      = order.shippingAddress || {};
                            const items     = order.items || [];
                            const summary   = order.summary || {};
                            const orderId   = order._id?.slice(-8).toUpperCase() || `ORD${idx + 1}`;
                            const status    = (order.status || 'pending').toLowerCase();
                            const canCancel = CANCELLABLE_STATUSES.includes(status);

                            return (
                                <div className="mo-card" key={order._id || idx}>

                                    <div className="mo-card-top" onClick={() => toggleExpand(order._id || idx)}>
                                        <div className="mo-card-left">
                                            <span className="mo-order-id">Order #{orderId}</span>
                                            <span className="mo-order-date">{formatDate(order.createdAt)}</span>
                                        </div>
                                        <div className="mo-card-right">
                                            <StatusBadge status={status} />
                                            <span className="mo-order-total">${(summary.total || 0).toFixed(2)}</span>
                                            <button className="mo-expand-btn">
                                                {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mo-delivery-bar">
                                        <Truck size={13} />
                                        <span>
                                            {status === 'delivered'
                                                ? '✓ Delivered'
                                                : status === 'cancelled'
                                                ? 'Order Cancelled'
                                                : `Estimated Delivery: ${getEstimatedDelivery(order.createdAt)}`}
                                        </span>
                                        <span className="mo-payment-tag">
                                            {order.paymentMethod === 'cod' ? '💵 COD' : '💳 Card'}
                                        </span>
                                    </div>

                                    <div className="mo-preview">
                                        {items.slice(0, 4).map((item, i) => (
                                            <div className="mo-preview-item" key={i} title={item.name}>
                                                <img
                                                    src={item.img || 'https://via.placeholder.com/44'}
                                                    alt={item.name}
                                                    onError={e => { e.target.src = 'https://via.placeholder.com/44'; }}
                                                />
                                            </div>
                                        ))}
                                        {items.length > 4 && (
                                            <div className="mo-preview-more">+{items.length - 4}</div>
                                        )}
                                        <span className="mo-items-count">{items.length} item{items.length > 1 ? 's' : ''}</span>

                                        {canCancel && (
                                            <button
                                                className="mo-cancel-btn"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirmId(order._id);
                                                }}
                                                disabled={cancellingId === order._id}
                                                style={{
                                                    marginLeft: 'auto',
                                                    padding: '5px 14px',
                                                    borderRadius: '999px',
                                                    border: '1.5px solid #ef4444',
                                                    background: '#fff',
                                                    color: '#ef4444',
                                                    fontSize: '0.78rem',
                                                    fontWeight: '600',
                                                    cursor: cancellingId === order._id ? 'not-allowed' : 'pointer',
                                                    opacity: cancellingId === order._id ? 0.6 : 1,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                            >
                                                <XCircle size={13} />
                                                {cancellingId === order._id ? 'Cancelling...' : 'Cancel Order'}
                                            </button>
                                        )}
                                    </div>

                                    {isOpen && (
                                        <div className="mo-details">
                                            <h4 className="mo-section-title">Items Ordered</h4>
                                            <div className="mo-items">
                                                {items.map((item, i) => (
                                                    <div className="mo-item-row" key={i}>
                                                        <img
                                                            src={item.img || 'https://via.placeholder.com/50'}
                                                            alt={item.name}
                                                            className="mo-item-img"
                                                            onError={e => { e.target.src = 'https://via.placeholder.com/50'; }}
                                                        />
                                                        <div className="mo-item-info">
                                                            <p className="mo-item-name">{item.name}</p>
                                                            <p className="mo-item-qty">Qty: {item.qty} · ${item.price?.toFixed(2)} each</p>
                                                        </div>
                                                        <p className="mo-item-price">${(item.price * item.qty).toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mo-bottom-grid">
                                                <div className="mo-address-box">
                                                    <h4 className="mo-section-title">Shipping Address</h4>
                                                    <p><strong>{addr.firstName} {addr.lastName}</strong></p>
                                                    {addr.street  && <p>{addr.street}</p>}
                                                    {addr.city    && <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} {addr.postal}</p>}
                                                    {addr.country && <p>{addr.country}</p>}
                                                    {addr.phone   && <p>📞 {addr.phone}</p>}
                                                </div>
                                                <div className="mo-summary-box">
                                                    <h4 className="mo-section-title">Summary</h4>
                                                    <div className="mo-sum-row"><span>Subtotal</span><span>${(summary.subtotal || 0).toFixed(2)}</span></div>
                                                    <div className="mo-sum-row">
                                                        <span>Shipping</span>
                                                        <span>{summary.shippingCost === 0 ? 'Free' : `$${(summary.shippingCost || 0).toFixed(2)}`}</span>
                                                    </div>
                                                    {summary.discount > 0 && (
                                                        <div className="mo-sum-row mo-discount">
                                                            <span>Discount</span><span>-${summary.discount.toFixed(2)}</span>
                                                        </div>
                                                    )}
                                                    <div className="mo-sum-row mo-sum-total">
                                                        <span>Total</span><span>${(summary.total || 0).toFixed(2)}</span>
                                                    </div>
                                                    <div className="mo-payment-method">
                                                        Payment: <strong>{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}</strong>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {confirmId && (
                <ConfirmModal
                    onConfirm={() => handleCancelOrder(confirmId)}
                    onClose={() => setConfirmId(null)}
                />
            )}
        </div>
    );
};

export default MyOrders;