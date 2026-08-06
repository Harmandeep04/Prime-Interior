import React, { useState, useEffect, useCallback } from 'react';
import { Trash2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'https://prime-interior-backend.onrender.com';

const STATUS_OPTIONS = ['pending', 'in-progress', 'completed'];

const statusStyle = {
    pending:     { bg: '#fff0db', color: '#b8681c' },
    'in-progress': { bg: '#e0f2fe', color: '#0369a1' },
    completed:   { bg: '#e0f2e9', color: '#2d6a4f' },
};

const ConsultationsManager = () => {
    const [consultations, setConsultations] = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [filter,        setFilter]        = useState('all');

    const fetchConsultations = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${BASE_URL}/api/consultations`);
            if (res.data.success) setConsultations(res.data.body);
        } catch (err) {
            toast.error('Could not load consultations ❌');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchConsultations(); }, [fetchConsultations]);

    const handleStatusChange = async (id, newStatus) => {
        // optimistic update
        setConsultations(prev =>
            prev.map(c => c._id === id ? { ...c, status: newStatus } : c)
        );
        try {
            await axios.patch(`${BASE_URL}/api/consultations/${id}`, { status: newStatus });
            toast.success(`Status updated to "${newStatus}" ✅`);
        } catch {
            toast.error('Failed to update status ❌');
            fetchConsultations();
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete consultation from "${name}"?`)) return;
        setConsultations(prev => prev.filter(c => c._id !== id));
        try {
            await axios.delete(`${BASE_URL}/api/consultations/${id}`);
            toast.success('Deleted! 🗑️');
        } catch {
            toast.error('Delete failed ❌');
            fetchConsultations();
        }
    };

    const filtered = filter === 'all'
        ? consultations
        : consultations.filter(c => c.status === filter);

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
            Loading consultations...
        </div>
    );

    return (
        <div className="admin-card">

            {/* ── Header ── */}
            <div className="admin-card-header">
                <h3>Consultation Bookings</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Filter tabs */}
                    {['all', ...STATUS_OPTIONS].map(f => (
                        <button key={f}
                            onClick={() => setFilter(f)}
                            style={{
                                padding: '6px 14px',
                                borderRadius: 999,
                                border: '1.5px solid',
                                borderColor: filter === f ? '#876445' : '#e7dfd4',
                                background: filter === f ? '#876445' : 'transparent',
                                color: filter === f ? '#fff' : '#876445',
                                fontWeight: 600,
                                fontSize: '0.78rem',
                                cursor: 'pointer',
                                textTransform: 'capitalize',
                                transition: 'all 0.2s',
                            }}
                        >
                            {f === 'all' ? `All (${consultations.length})` : `${f} (${consultations.filter(c => c.status === f).length})`}
                        </button>
                    ))}
                    <button
                        onClick={fetchConsultations}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#876445', display: 'flex', alignItems: 'center' }}
                        title="Refresh"
                    >
                        <RefreshCw size={16} />
                    </button>
                </div>
            </div>

            {/* ── Table ── */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#999', fontStyle: 'italic' }}>
                                    No consultations found.
                                </td>
                            </tr>
                        ) : filtered.map((c, i) => {
                            const st = statusStyle[c.status] || statusStyle.pending;
                            return (
                                <tr key={c._id}>
                                    <td style={{ color: '#aaa', fontSize: '0.8rem' }}>{i + 1}</td>
                                    <td style={{ fontWeight: 600 }}>{c.name}</td>
                                    <td style={{ color: '#555' }}>{c.email}</td>
                                    <td style={{ color: '#555' }}>{c.phone || '—'}</td>
                                    <td style={{ maxWidth: 220, color: '#666', fontSize: '0.85rem' }}>
                                        <span title={c.message}>
                                            {c.message.length > 60 ? c.message.slice(0, 60) + '...' : c.message}
                                        </span>
                                    </td>
                                    <td style={{ color: '#888', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        <select
                                            value={c.status}
                                            onChange={e => handleStatusChange(c._id, e.target.value)}
                                            style={{
                                                padding: '5px 10px',
                                                borderRadius: 999,
                                                border: 'none',
                                                background: st.bg,
                                                color: st.color,
                                                fontWeight: 600,
                                                fontSize: '0.78rem',
                                                cursor: 'pointer',
                                                outline: 'none',
                                                textTransform: 'capitalize',
                                            }}
                                        >
                                            {STATUS_OPTIONS.map(s => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className="btn-danger-icon"
                                            onClick={() => handleDelete(c._id, c.name)}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ConsultationsManager;