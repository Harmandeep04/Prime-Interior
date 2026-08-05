import React from 'react';
import { Search, User, Heart, ShoppingBag, ChevronDown } from 'lucide-react'; // Using lucide for icons
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar-container">

      {/* Main Nav */}
      <div className="main-nav">
        <ul className="nav-links">
          <li className='dropdown'>SHOP <ChevronDown size={14} />
           <ul className="dropdown-menu">
              <li>Blog Grid</li>
              <li>Blog List</li>
              <li>Blog Details</li>
            </ul></li>
          <li className='dropdown'>PRODUCTS <ChevronDown size={14} />
           <ul className="dropdown-menu">
              <li>Blog Grid</li>
              <li>Blog List</li>
              <li>Blog Details</li>
            </ul></li>
          <li className="dropdown">
            BLOGS <ChevronDown size={14} />
            <ul className="dropdown-menu">
              <li>Blog Grid</li>
              <li>Blog List</li>
              <li>Blog Details</li>
            </ul>
          </li>
          <li className='dropdown'>PAGES <ChevronDown size={14} />
           <ul className="dropdown-menu">
              <li>Blog Grid</li>
              <li>Blog List</li>
              <li>Blog Details</li>
            </ul></li>
          <li className='dropdown' >DEMOS <ChevronDown size={14} />
           <ul className="dropdown-menu">
              <li>Blog Grid</li>
              <li>Blog List</li>
              <li>Blog Details</li>
            </ul></li>
        </ul>

        <div className="logo">
          <h1>GearO</h1>
        </div>

        <div className="nav-icons">
          <Search size={20} />
          <User size={20} />
          <Heart size={20} />
          <div className="cart-icon">
            <ShoppingBag size={20} />
            <span className="cart-count">0</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;