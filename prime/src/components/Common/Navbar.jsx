import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Heart, ShoppingBag, ChevronDown, LogOut, ArrowLeft, Menu, X, Package, UserCircle } from 'lucide-react';
import './Navbar.css';
import SearchModal from '../../pages/SearchModal';
import CartSidebar from '../../pages/CartSidebar';

import { WishlistContext } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
    const navigate  = useNavigate();
    const location  = useLocation();

    // ── Wishlist ──
    const wishlistCtx    = useContext(WishlistContext);
    const wishlistCount  = wishlistCtx?.wishlistItems?.length || 0;

    // ── Cart ──
    const { totalItems, setCartOpen } = useCart();

    const [user,         setUser]         = useState(null);
    const [menuOpen,     setMenuOpen]     = useState(false);
    const [searchOpen,   setSearchOpen]   = useState(false);
    const [userDropdown, setUserDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const isHomePage = location.pathname === '/';

    // ✅ isLoggedIn — user state ton check karo
    const isLoggedIn = !!user;

    // ── LocalStorage Sync ──
    useEffect(() => {
        const handleSyncUser = () => {
            const savedUser = localStorage.getItem('user');
            if (savedUser) {
                try { setUser(JSON.parse(savedUser)); }
                catch (e) { console.error('User parse error', e); }
            } else {
                setUser(null);
            }
        };
        handleSyncUser();
        window.addEventListener('storage', handleSyncUser);
        return () => window.removeEventListener('storage', handleSyncUser);
    }, []);

    // ── Close dropdown on outside click ──
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setUserDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ── Escape key ──
    useEffect(() => {
        const handler = (e) => {
            if (e.key === 'Escape') {
                setSearchOpen(false);
                setUserDropdown(false);
            }
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('user');
        localStorage.removeItem('userEmail');
        setUser(null);
        setUserDropdown(false);
        window.dispatchEvent(new Event('storage'));
        navigate('/login');
    }, [navigate]);

    // ── Cart click — bina login redirect ──
    const handleCartClick = () => {
        if (!isLoggedIn) { navigate('/login'); return; }
        setCartOpen(true);
    };

    // ── Wishlist click — bina login redirect ──
    const handleWishlistClick = () => {
        if (!isLoggedIn) { navigate('/login'); return; }
        navigate('/wishlist');
    };

    const getUserInitials = () => {
        if (!user) return '';
        const first = user.firstName?.trim()?.[0] || '';
        const last  = user.lastName?.trim()?.[0]  || '';
        return (first + last).toUpperCase() || user.email?.[0]?.toUpperCase() || 'U';
    };

    const getDisplayName = () => {
        if (!user) return '';
        return user.firstName?.trim()
            ? user.firstName.trim()
            : user.email?.split('@')[0] || 'USER';
    };

    return (
        <>
        <nav className="navbar-container">
            <div className="main-nav">

                {/* ── Left: Back + Logo ── */}
                <div className="logo-section">
                    {!isHomePage && (
                        <button className="back-btn" onClick={() => navigate(-1)} title="Go Back">
                            <ArrowLeft size={18} />
                            <span>Back</span>
                        </button>
                    )}
                    <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                        <h1>Prime Interior</h1>
                    </div>
                </div>

                {/* ── Center: Nav Links Desktop ── */}
                <ul className="nav-links">
                    <li className='dropdown mega-menu-wrapper'>
                        SHOP <ChevronDown size={14} />
                        <div className="mega-menu">
                            <div className="mega-menu-content">
                                <div className="mega-col">
                                    <h3>Interior Design</h3>
                                    <ul>
                                        <li onClick={() => navigate('/living-room')}>Living Room</li>
                                        <li onClick={() => navigate('/modular-kitchen')}>Modular Kitchen</li>
                                        <li onClick={() => navigate('/bedroom-design')}>Bedroom Design</li>
                                        <li onClick={() => navigate('/home-office')}>Home Office</li>
                                    </ul>
                                </div>
                                <div className="mega-col">
                                    <h3>Exterior Design</h3>
                                    <ul>
                                        <li onClick={() => navigate('/garden-landscape')}>Garden & Landscape</li>
                                        <li onClick={() => navigate('/terrace-design')}>Terrace Design</li>
                                        <li onClick={() => navigate('/balcony-makeover')}>Balcony Makeover</li>
                                        <li onClick={() => navigate('/exterior-elevation')}>Exterior Elevation</li>
                                    </ul>
                                </div>
                                <div className="mega-col">
                                    <h3>Special Services</h3>
                                    <ul>
                                        <li onClick={() => navigate('/full-renovation')}>Full Home Renovation</li>
                                        <li onClick={() => navigate('/commercial-design')}>Commercial Design</li>
                                        <li onClick={() => navigate('/color-consultation')}>Color Consultation</li>
                                    </ul>
                                </div>
                                <div className="mega-col promo-image">
                                    <div className="promo-box">
                                        <img src="/images/exploreee.jpg" alt="Promo" />
                                        <div className="promo-text">
                                            <h4>Design Your Dream Space</h4>
                                            <button onClick={(e) => {
                                                e.stopPropagation();
                                                window.open('https://wa.me/91XXXXXXXXXX', '_blank');
                                            }}>Get Quote</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>

                    <li className='dropdown simple-dropdown-wrapper'>
                        PRODUCTS <ChevronDown size={14} />
                        <ul className="simple-dropdown">
                            <li onClick={() => navigate('/luxury-furniture')}>Luxury Furniture</li>
                            <li onClick={() => navigate('/designer-lighting')}>Designer Lighting</li>
                            <li onClick={() => navigate('/wall-decor')}>Wall Decor</li>
                            <li onClick={() => navigate('/flooring-rugs')}>Flooring & Rugs</li>
                        </ul>
                    </li>

                    <li className='dropdown simple-dropdown-wrapper'>
                        EXPLORE <ChevronDown size={14} />
                        <ul className="simple-dropdown">
                            <li onClick={() => navigate('/about')}>About Our Studio</li>
                            <li onClick={() => navigate('/our-process')}>Our Process</li>
                            <li onClick={() => navigate('/portfolio')}>Portfolio</li>
                            <li onClick={() => navigate('/contact')}>Contact Us</li>
                        </ul>
                    </li>
                </ul>

                {/* ── Right: Icons ── */}
                <div className="nav-icons">
                    <Search
                        size={20}
                        onClick={() => setSearchOpen(true)}
                        style={{ cursor: 'pointer' }}
                        className="desktop-icon"
                    />

                    {/* ── User Icon / Dropdown ── */}
                    {user ? (
                        <div className="user-menu-wrapper" ref={dropdownRef}>
                            <button
                                className="user-avatar-btn"
                                onClick={() => setUserDropdown(prev => !prev)}
                                title={getDisplayName()}
                            >
                                <span className="user-avatar-circle">
                                    {getUserInitials()}
                                </span>
                                <span className="user-name-label">
                                    HI, {getDisplayName().toUpperCase()}
                                </span>
                                <ChevronDown size={13} className={`avatar-chevron ${userDropdown ? 'open' : ''}`} />
                            </button>

                            {userDropdown && (
                                <div className="user-dropdown">
                                    <div className="ud-header">
                                        <span className="ud-avatar">{getUserInitials()}</span>
                                        <div className="ud-info">
                                            <p className="ud-name">
                                                {user.firstName && user.lastName
                                                    ? `${user.firstName} ${user.lastName}`
                                                    : getDisplayName()}
                                            </p>
                                            <p className="ud-email">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="ud-divider" />
                                    <button className="ud-item" onClick={() => { navigate('/profile'); setUserDropdown(false); }}>
                                        <UserCircle size={16} />
                                        <span>My Profile</span>
                                    </button>
                                    <button className="ud-item" onClick={() => { navigate('/my-orders'); setUserDropdown(false); }}>
                                        <Package size={16} />
                                        <span>My Orders</span>
                                    </button>
                                    <div className="ud-divider" />
                                    <button className="ud-item ud-logout" onClick={handleLogout}>
                                        <LogOut size={16} />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <User
                            size={20}
                            onClick={() => navigate('/login')}
                            style={{ cursor: 'pointer' }}
                            className="desktop-icon"
                        />
                    )}

                    {/* ── Wishlist Heart Icon ── */}
                    <div
                        className="cart-icon desktop-icon"
                        onClick={handleWishlistClick}
                        style={{ cursor: 'pointer' }}
                        title="View Wishlist"
                    >
                        <Heart
                            size={20}
                            fill={isLoggedIn && wishlistCount > 0 ? '#e53e3e' : 'none'}
                            color={isLoggedIn && wishlistCount > 0 ? '#e53e3e' : '#333'}
                        />
                        {/* ✅ Sirf login hone te count dikhao */}
                        {isLoggedIn && wishlistCount > 0 && (
                            <span className="cart-count" style={{ background: '#e53e3e' }}>
                                {wishlistCount}
                            </span>
                        )}
                    </div>

                    {/* ── Cart Icon ── */}
                    <div
                        className="cart-icon"
                        onClick={handleCartClick}
                        style={{ cursor: 'pointer' }}
                        title="Open Cart"
                    >
                        <ShoppingBag size={20} />
                        {/* ✅ Sirf login hone te count dikhao */}
                        {isLoggedIn && totalItems > 0 && (
                            <span className="cart-count">{totalItems}</span>
                        )}
                    </div>

                    <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </div>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            <div className={`mobile-menu ${menuOpen ? 'show' : ''}`}>
                <ul>
                    <li onClick={() => { navigate('/');                setMenuOpen(false); }}>Home</li>
                    <li onClick={() => { navigate('/living-room');     setMenuOpen(false); }}>Living Room</li>
                    <li onClick={() => { navigate('/modular-kitchen'); setMenuOpen(false); }}>Modular Kitchen</li>
                    <li onClick={() => { navigate('/bedroom-design');  setMenuOpen(false); }}>Bedroom Design</li>
                    <li onClick={() => { navigate('/home-office');     setMenuOpen(false); }}>Home Office</li>
                    <li onClick={() => { navigate('/about');           setMenuOpen(false); }}>About Us</li>
                    <li onClick={() => { navigate('/portfolio');       setMenuOpen(false); }}>Portfolio</li>
                    <li onClick={() => { navigate('/contact');         setMenuOpen(false); }}>Contact Us</li>
                    {user ? (
                        <>
                            <li onClick={() => { navigate('/profile');   setMenuOpen(false); }}>My Profile</li>
                            <li onClick={() => { navigate('/my-orders'); setMenuOpen(false); }}>My Orders</li>
                            <li onClick={() => { handleLogout(); setMenuOpen(false); }}>Logout</li>
                        </>
                    ) : (
                        <li onClick={() => { navigate('/login'); setMenuOpen(false); }}>Login / Signup</li>
                    )}
                </ul>
                <div className="mobile-icons">
                    <Search
                        size={20}
                        onClick={() => { setSearchOpen(true); setMenuOpen(false); }}
                        style={{ cursor: 'pointer' }}
                    />

                    {/* Mobile Wishlist */}
                    <div
                        className="cart-icon"
                        onClick={() => { handleWishlistClick(); setMenuOpen(false); }}
                        style={{ cursor: 'pointer' }}
                    >
                        <Heart
                            size={20}
                            fill={isLoggedIn && wishlistCount > 0 ? '#e53e3e' : 'none'}
                            color={isLoggedIn && wishlistCount > 0 ? '#e53e3e' : '#333'}
                        />
                        {isLoggedIn && wishlistCount > 0 && (
                            <span className="cart-count" style={{ background: '#e53e3e' }}>
                                {wishlistCount}
                            </span>
                        )}
                    </div>

                    {/* Mobile Cart */}
                    <div
                        className="cart-icon"
                        onClick={() => { handleCartClick(); setMenuOpen(false); }}
                        style={{ cursor: 'pointer' }}
                    >
                        <ShoppingBag size={20} />
                        {isLoggedIn && totalItems > 0 && (
                            <span className="cart-count">{totalItems}</span>
                        )}
                    </div>
                </div>
            </div>
        </nav>

        <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
        <CartSidebar />
        </>
    );
};

export default Navbar;