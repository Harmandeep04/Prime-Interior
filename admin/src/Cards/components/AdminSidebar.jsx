import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Users,
  UserCircle,
  CalendarCheck,
  LogOut,
} from 'lucide-react';

const AdminSidebar = ({ activeTab, setActiveTab, mobileOpen, setMobileOpen }) => {

  const menuItems = [
    { id: 'dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
    { id: 'products',      label: 'Products',      icon: ShoppingBag     },
    { id: 'orders',        label: 'Orders',        icon: ShoppingCart    },
    { id: 'users',         label: 'Users',         icon: Users           },
    { id: 'consultations', label: 'Consultations', icon: CalendarCheck   },
    { id: 'profile',       label: 'My Profile',    icon: UserCircle      },
  ];

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'https://prime-interior-eu2b.vercel.app/login';
};

  const handleNav = (id) => {
    setActiveTab(id);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <div className={`admin-sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="admin-logo">PRIME INTERIOR</div>
      <nav className="admin-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleNav(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div style={{
        marginTop: 'auto',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        paddingTop: '16px',
      }}>
        <button className="admin-nav-item" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Exit Panel</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;