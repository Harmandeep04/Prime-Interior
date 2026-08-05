import React, { useState, useEffect } from 'react';
import Dashboard from './Cards/page/Dashboard';
import ProductsManager from './Cards/page/ProductsManager';
import OrdersManager from './Cards/page/OrdersManager';
import UsersManager from './Cards/page/UsersManager';
import ProfileDetails from './Cards/page/ProfileDetails';
import ConsultationsManager from './Cards/page/ConsultationsManager';
import AdminHeader from './Cards/components/AdminHeader';
import AdminSidebar from './Cards/components/AdminSidebar';
import './css/Admin.css';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const email = (localStorage.getItem('userEmail') || '').trim().toLowerCase();
    if (!email || email !== 'primeinterior101@gmail.com') {
      window.location.href = 'http://localhost:3001/login';
    }
  }, []);

  const handleSetActiveTab = (tab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':     return <Dashboard setActiveTab={handleSetActiveTab} />;
      case 'products':      return <ProductsManager />;
      case 'orders':        return <OrdersManager />;
      case 'users':         return <UsersManager />;
      case 'consultations': return <ConsultationsManager />;
      case 'profile':       return <ProfileDetails setActiveTab={handleSetActiveTab} />;
      default:              return <Dashboard setActiveTab={handleSetActiveTab} />;
    }
  };

  return (
    <div className="admin-layout">
      <div
        className={`admin-sidebar-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="admin-content">
        <AdminHeader
          activeTab={activeTab}
          setActiveTab={handleSetActiveTab}
          setMobileOpen={setMobileOpen}
        />
        <main className="admin-page-container">
          {renderActivePage()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;