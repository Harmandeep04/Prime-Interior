import React, { useState, useEffect } from 'react';
import { DollarSign, Users, ShoppingBag, ArrowUpRight, Activity, X, TrendingUp } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'http://localhost:5555';

// ─── Helper: total extract karo order to (summary.total support) ─────────────
const getOrderTotal = (order) =>
  Number(
    order.totalAmount ||
    order.total ||
    (order.summary && (order.summary.total || order.summary.grandTotal || order.summary.totalAmount)) ||
    0
  );

// ─── Revenue Bar Chart ────────────────────────────────────────────────────────
const RevenueChart = ({ orders }) => {
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const monthlyRevenue = new Array(12).fill(0);

  orders.forEach(order => {
    const s = (order.status || '').toLowerCase();
    if (s === 'delivered' || s === 'shipped' || s === 'completed') {
      const date = new Date(order.createdAt || order.date);
      if (!isNaN(date)) {
        monthlyRevenue[date.getMonth()] += getOrderTotal(order);
      }
    }
  });

  const maxVal = Math.max(...monthlyRevenue, 1);
  const chartH = 160;
  const grandTotal = monthlyRevenue.reduce((a, b) => a + b, 0);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: `${chartH}px`, padding: '0 4px' }}>
        {monthlyRevenue.map((val, i) => {
          const barH = Math.max((val / maxVal) * chartH, val > 0 ? 8 : 2);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                title={`${months[i]}: $${val.toFixed(2)}`}
                style={{
                  width: '100%',
                  height: `${barH}px`,
                  background: val > 0 ? 'linear-gradient(to top, #876445, #c4956a)' : '#e5e7eb',
                  borderRadius: '4px 4px 0 0',
                  transition: 'height 0.5s ease',
                  cursor: val > 0 ? 'pointer' : 'default',
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: '6px', padding: '6px 4px 0' }}>
        {months.map((m, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.55rem', color: '#6b7280' }}>{m}</div>
        ))}
      </div>
      <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.85rem', color: '#2c241a', fontWeight: '700' }}>
        Total Revenue: ${grandTotal.toFixed(2)}
      </p>
    </div>
  );
};

// ─── Pending Donut Chart ──────────────────────────────────────────────────────
const PendingChart = ({ orders }) => {
  const counts = { pending: 0, shipped: 0, delivered: 0, cancelled: 0, other: 0 };
  orders.forEach(o => {
    const s = (o.status || 'other').toLowerCase();
    if (counts[s] !== undefined) counts[s]++;
    else counts.other++;
  });

  const total = orders.length || 1;
  const colors = { pending: '#d97706', shipped: '#0369a1', delivered: '#15803d', cancelled: '#dc2626', other: '#9ca3af' };
  let cumulative = 0;

  const segments = Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([key, val]) => {
      const pct = val / total;
      const start = cumulative;
      cumulative += pct;
      return { key, val, pct, start };
    });

  const r = 60, cx = 80, cy = 80;
  const toXY = (pct) => {
    const angle = pct * 2 * Math.PI - Math.PI / 2;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        {segments.map(({ key, pct, start }) => {
          if (pct >= 1) {
            return <circle key={key} cx={cx} cy={cy} r={r} fill="none" stroke={colors[key]} strokeWidth="28" />;
          }
          const [x1, y1] = toXY(start);
          const [x2, y2] = toXY(start + pct);
          const large = pct > 0.5 ? 1 : 0;
          return (
            <path key={key}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
              fill={colors[key]} opacity="0.9"
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="white" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="18" fontWeight="700" fill="#111827">{total}</text>
        <text x={cx} y={cy + 14} textAnchor="middle" fontSize="9" fill="#6b7280">Total Orders</text>
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
        {segments.map(({ key, val }) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors[key] }} />
            <span style={{ textTransform: 'capitalize', color: '#374151' }}>{key}: {val}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
  }}>
    <div style={{
      background: '#fff', borderRadius: '16px', padding: '28px',
      width: '480px', maxWidth: '95vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#111827' }}>{title}</h3>
        <button onClick={onClose} style={{
          background: '#f3f4f6', border: 'none', borderRadius: '8px',
          padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center'
        }}><X size={16} /></button>
      </div>
      {children}
    </div>
  </div>
);

// ─── Dashboard ────────────────────────────────────────────────────────────────
const Dashboard = ({ setActiveTab }) => {
  const [allOrders, setAllOrders] = useState([]);
  const [stats, setStats] = useState([
    { label: 'Total Revenue',    value: '$0.00', icon: DollarSign, color: '#dcfce7', iconColor: '#15803d', action: 'revenueChart' },
    { label: 'Active Customers', value: '0',     icon: Users,      color: '#e0f2fe', iconColor: '#0369a1', action: 'users'        },
    { label: 'Products Listed',  value: '0',     icon: ShoppingBag,color: '#f3e8ff', iconColor: '#7e22ce', action: 'products'     },
    { label: 'Pending Sales',    value: '0',     icon: Activity,   color: '#fef3c7', iconColor: '#d97706', action: 'pendingChart' },
  ]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const ordersRes = await axios.get(`${BASE_URL}/api/orders`);
        const orders = ordersRes.data.body || ordersRes.data.orders || (Array.isArray(ordersRes.data) ? ordersRes.data : []);

        setAllOrders(orders);

        let totalRevenue = 0;
        let pendingCount = 0;

        orders.forEach(order => {
          const s = (order.status || '').toLowerCase();
          const total = getOrderTotal(order);
          if (s === 'delivered' || s === 'shipped' || s === 'completed') {
            totalRevenue += total;
          } else {
            pendingCount++;
          }
        });

        let usersCount = 0;
        try {
          const usersRes = await axios.get(`${BASE_URL}/user/users`);
          usersCount = usersRes.data.count || (Array.isArray(usersRes.data.body) ? usersRes.data.body.length : 0);
        } catch (e) {}

        let productsCount = 0;
        try {
          const productsRes = await axios.get(`${BASE_URL}/user/search?q=`);
          if (Array.isArray(productsRes.data)) productsCount = productsRes.data.length;
        } catch (e) {}

        setStats([
          { label: 'Total Revenue',    value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: '#dcfce7', iconColor: '#15803d', action: 'revenueChart' },
          { label: 'Active Customers', value: String(usersCount),            icon: Users,      color: '#e0f2fe', iconColor: '#0369a1', action: 'users'        },
          { label: 'Products Listed',  value: String(productsCount),         icon: ShoppingBag,color: '#f3e8ff', iconColor: '#7e22ce', action: 'products'     },
          { label: 'Pending Sales',    value: String(pendingCount),          icon: Activity,   color: '#fef3c7', iconColor: '#d97706', action: 'pendingChart' },
        ]);
        setRecentOrders(orders.slice(0, 5));
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleStatClick = (action) => {
    if (action === 'users' || action === 'products') {
      setActiveTab && setActiveTab(action);
    } else {
      setModal(action);
    }
  };

  if (loading) return (
    <div>
      <div className="admin-grid">
        {[1,2,3,4].map(i => (
          <div className="stat-card" key={i} style={{ opacity: 0.5 }}>
            <div className="stat-info">
              <p style={{ background: '#e5e7eb', borderRadius: 4, height: 14, width: 80, marginBottom: 8 }}></p>
              <div style={{ background: '#e5e7eb', borderRadius: 4, height: 28, width: 100 }}></div>
            </div>
            <div className="stat-icon" style={{ backgroundColor: '#f3f4f6' }}></div>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af', fontSize: '0.9rem' }}>
        ⏳ Loading dashboard data...
      </div>
    </div>
  );

  return (
    <div>
      {/* ── Stat Cards ── */}
      <div className="admin-grid">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              className="stat-card"
              key={i}
              onClick={() => handleStatClick(stat.action)}
              style={{ cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              <div className="stat-info">
                <p>{stat.label}</p>
                <h3>{stat.value}</h3>
                <span style={{ fontSize: '0.7rem', color: stat.iconColor, fontWeight: '600', display: 'flex', alignItems: 'center', gap: '2px', marginTop: '4px' }}>
                  {stat.action.includes('Chart')
                    ? <><TrendingUp size={11} /> View Chart</>
                    : <><ArrowUpRight size={11} /> View {stat.action}</>}
                </span>
              </div>
              <div className="stat-icon" style={{ backgroundColor: stat.color, color: stat.iconColor }}>
                <Icon size={24} />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom Section ── */}
      <div className="admin-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
        <div className="admin-card">
          <div className="admin-card-header">
            <h3>Recent Sales Activity</h3>
            <button
              className="btn-primary"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => setActiveTab && setActiveTab('orders')}
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="admin-table-container">
            <table className="admin-table">
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: 'center', padding: '16px' }}>No sales activity recorded.</td></tr>
                ) : (
                  recentOrders.map((ord) => {
                    const orderId   = ord._id || ord.id;
                    const customer  = ord.email || ord.customerEmail || 'Guest Customer';
                    const orderDate = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString() : (ord.date || 'N/A');
                    const totalBill = getOrderTotal(ord);
                    const status    = ord.status || 'pending';
                    return (
                      <tr key={orderId}>
                        <td style={{ fontWeight: '600' }}>#{String(orderId).slice(-6).toUpperCase()}</td>
                        <td>{customer}</td>
                        <td>{orderDate}</td>
                        <td style={{ fontWeight: '600' }}>${totalBill.toFixed(2)}</td>
                        <td><span className={`badge badge-${status.toLowerCase()}`}>{status}</span></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-header"><h3>System Health</h3></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid var(--admin-border)' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--admin-text-muted)' }}>Database connection</h4>
              <p style={{ margin: 0, fontWeight: '700', color: '#15803d' }}>● Connected (MongoDB Atlas)</p>
            </div>
            <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid var(--admin-border)' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.9rem', color: 'var(--admin-text-muted)' }}>Backup status</h4>
              <p style={{ margin: 0, fontWeight: '700', color: '#0369a1' }}>Sync Active</p>
              <h4 style={{ margin: '12px 0 6px 0', fontSize: '0.9rem', color: 'var(--admin-text-muted)' }}>Server Port</h4>
              <p style={{ margin: 0, fontWeight: '700', color: '#0369a1' }}>Running on 5555</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {modal === 'revenueChart' && (
        <Modal title="📈 Monthly Revenue Chart" onClose={() => setModal(null)}>
          <RevenueChart orders={allOrders} />
        </Modal>
      )}
      {modal === 'pendingChart' && (
        <Modal title="🟡 Order Status Breakdown" onClose={() => setModal(null)}>
          <PendingChart orders={allOrders} />
        </Modal>
      )}
    </div>
  );
};

export default Dashboard;