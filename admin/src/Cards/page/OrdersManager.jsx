import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2, AlertTriangle } from 'lucide-react';

const BASE_URL = 'https://prime-interior-backend.onrender.com';

const STATUS_OPTIONS = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const STATUS_COLORS = {
    pending:   { bg: '#fff0db', color: '#b8681c' },
    confirmed: { bg: '#e0f2fe', color: '#0369a1' },
    shipped:   { bg: '#f5f3ff', color: '#7e22ce' },
    delivered: { bg: '#e0f2e9', color: '#2d6a4f' },
    cancelled: { bg: '#fef2f2', color: '#dc2626' },
};

const tableStyles = `
    .admin-table-container {
        width: 100%;
        overflow-x: hidden;
    }
    .admin-table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
    }
    .admin-table th:nth-child(1) { width: 8%; }
    .admin-table th:nth-child(2) { width: 18%; }
    .admin-table th:nth-child(3) { width: 9%; }
    .admin-table th:nth-child(4) { width: 22%; }
    .admin-table th:nth-child(5) { width: 9%; }
    .admin-table th:nth-child(6) { width: 10%; }
    .admin-table th:nth-child(7) { width: 13%; }
    .admin-table th:nth-child(8) { width: 11%; }
`;

const DeleteModal = ({ onConfirm, onClose }) => (
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
                Delete Order?
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
                This will permanently delete the order from the database. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button onClick={onClose} style={{
                    flex: 1, padding: '10px 0', borderRadius: 8,
                    border: '1.5px solid #e5e5e5', background: '#fff',
                    color: '#555', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer',
                }}>
                    Cancel
                </button>
                <button onClick={onConfirm} style={{
                    flex: 1, padding: '10px 0', borderRadius: 8,
                    border: 'none', background: '#ef4444',
                    color: '#fff', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                }}>
                    Yes, Delete
                </button>
            </div>
        </div>
    </div>
);

const OrdersManager = () => {
    const [orders,          setOrders]          = useState([]);
    const [loading,         setLoading]         = useState(true);
    const [deletingId,      setDeletingId]      = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/orders`);
            const fetched = res.data.body || res.data.orders || (Array.isArray(res.data) ? res.data : []);
            setOrders(fetched);
        } catch (err) {
            console.error('Error fetching orders:', err);
            toast.error('Failed to load orders ❌');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const handleStatusChange = async (id, newStatus) => {
    setOrders(prev => prev.map(o => (o._id === id ? { ...o, status: newStatus } : o)));
    try {
        await axios.put(`${BASE_URL}/api/orders/${id}`, { status: newStatus });
        toast.success(`Status updated to "${newStatus}" ✅`);
        toast.info(`📧 Email sent to customer`);
        fetchOrders();
    } catch (err) {
        console.error('Status update error:', err);
        toast.error('Server error ❌');
        fetchOrders();
    }
};

    const handleDeleteOrder = async (orderId) => {
        setConfirmDeleteId(null);
        try {
            setDeletingId(orderId);
            await axios.delete(`${BASE_URL}/api/orders/${orderId}`);
            setOrders(prev => prev.filter(o => o._id !== orderId));
            toast.success('Order deleted successfully 🗑️');
        } catch (err) {
            console.error('Delete error:', err);
            const msg = err.response?.data?.message || 'Failed to delete order.';
            toast.error(`❌ ${msg}`);
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-muted)' }}>
            Loading orders...
        </div>
    );

    return (
        <div className="admin-card">
            {/* Inline styles to fix horizontal scroll */}
            <style>{tableStyles}</style>

            <div className="admin-card-header">
                <h3>Customer Orders</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--admin-text-muted)' }}>
                        Total: {orders.length} orders
                    </span>
                    <button onClick={fetchOrders} style={{
                        padding: '5px 14px', borderRadius: '999px',
                        border: '1.5px solid #e5e5e5', background: '#fff',
                        color: '#555', fontSize: '0.78rem', fontWeight: '600', cursor: 'pointer',
                    }}>
                        🔄 Refresh
                    </button>
                </div>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '24px', color: 'var(--admin-text-muted)' }}>
                                    No orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((ord) => {
                                const orderId     = ord._id || ord.id;
                                const customer    = ord.email || 'Guest';
                                const date        = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-IN') : 'N/A';
                                const items       = Array.isArray(ord.items)
                                    ? ord.items.map(i => `${i.name} (${i.qty})`).join(', ')
                                    : 'N/A';
                                const total       = ord.summary?.total || ord.totalAmount || 0;
                                const status      = (ord.status || 'pending').toLowerCase();
                                const statusStyle = STATUS_COLORS[status] || STATUS_COLORS.pending;

                                return (
                                    <tr key={orderId}>
                                        <td style={{ fontWeight: '600', fontSize: '0.82rem' }}>
                                            #{String(orderId).slice(-6).toUpperCase()}
                                        </td>
                                        <td style={{
                                            fontSize: '0.85rem',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {customer}
                                        </td>
                                        <td style={{ fontSize: '0.85rem' }}>{date}</td>
                                        {/* FIXED: whiteSpace normal instead of nowrap */}
                                        <td style={{
                                            fontSize: '0.78rem',
                                            color: 'var(--admin-text-muted)',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'normal',
                                            wordBreak: 'break-word',
                                            lineHeight: '1.4',
                                        }}>
                                            {items}
                                        </td>
                                        <td style={{ fontWeight: '600' }}>${Number(total).toFixed(2)}</td>
                                        <td>
                                            <span style={{
                                                padding: '3px 8px', borderRadius: '999px',
                                                fontSize: '0.75rem', fontWeight: '600',
                                                background: ord.paymentMethod === 'cod' ? '#fef3c7' : '#e0f2fe',
                                                color:      ord.paymentMethod === 'cod' ? '#b45309'  : '#0369a1',
                                            }}>
                                                {ord.paymentMethod === 'cod' ? '💵 COD' : '💳 Card'}
                                            </span>
                                        </td>
                                        <td>
                                            <select
                                                value={status}
                                                onChange={(e) => handleStatusChange(orderId, e.target.value)}
                                                style={{
                                                    padding: '5px 6px', borderRadius: '999px',
                                                    border: `1px solid ${statusStyle.color}`,
                                                    background: statusStyle.bg, color: statusStyle.color,
                                                    fontWeight: '600', fontSize: '0.75rem',
                                                    cursor: 'pointer', outline: 'none',
                                                    width: '100%',
                                                }}
                                            >
                                                {STATUS_OPTIONS.map(s => (
                                                    <option key={s} value={s}>
                                                        {s.charAt(0).toUpperCase() + s.slice(1)}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => setConfirmDeleteId(orderId)}
                                                disabled={deletingId === orderId}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '4px',
                                                    padding: '5px 10px', borderRadius: '999px',
                                                    border: '1.5px solid #ef4444', background: '#fff',
                                                    color: '#ef4444', fontSize: '0.75rem', fontWeight: '600',
                                                    cursor: deletingId === orderId ? 'not-allowed' : 'pointer',
                                                    opacity: deletingId === orderId ? 0.6 : 1,
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                <Trash2 size={13} />
                                                {deletingId === orderId ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {confirmDeleteId && (
                <DeleteModal
                    onConfirm={() => handleDeleteOrder(confirmDeleteId)}
                    onClose={() => setConfirmDeleteId(null)}
                />
            )}
        </div>
    );
};

export default OrdersManager;