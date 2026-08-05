import React from 'react';
import { Menu } from 'lucide-react';

const AdminHeader = ({ activeTab, setActiveTab, setMobileOpen }) => {
  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'dashboard':     return 'Dashboard Overview';
      case 'products':      return 'Products Catalog';
      case 'orders':        return 'Manage Orders';
      case 'users':         return 'Registered Users';
      case 'consultations': return 'Consultation Bookings';
      case 'profile':       return 'Administrator Profile';
      default:              return 'Admin Panel';
    }
  };

  const adminEmail = localStorage.getItem('userEmail') || 'admin@prime.com';
  const firstName  = localStorage.getItem('firstName') || 'Ramanveer';
  const lastName   = localStorage.getItem('lastName')  || 'Kaur';
  const initial    = (firstName.charAt(0) || 'A').toUpperCase();

  return (
    <header className="admin-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          className="admin-hamburger"
          onClick={() => setMobileOpen && setMobileOpen(prev => !prev)}
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <h2>{getHeaderTitle()}</h2>
      </div>

      <div className="admin-profile" onClick={() => setActiveTab('profile')}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, fontWeight: '600', fontSize: '0.9rem' }}>
            {firstName} {lastName}
          </p>
          <p className="admin-profile-email" style={{ margin: 0, fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
            {adminEmail}
          </p>
        </div>
        <div className="admin-avatar">{initial}</div>
      </div>
    </header>
  );
};

export default AdminHeader;