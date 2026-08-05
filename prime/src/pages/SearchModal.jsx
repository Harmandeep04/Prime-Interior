import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ArrowUpRight } from 'lucide-react';
import '../pages/css/SearchModal.css';

const allProducts = [
    { id: 1,  name: "Ergonomic Chair Pro",         price: 79.99,  img: "/images/product-chair(1.1).jpg", category: "Chairs"    },
    { id: 2,  name: "Open Box - Adjustable Stand",  price: 79.99,  img: "/images/product-2.1.jpg",        category: "Stands"    },
    { id: 3,  name: "Laptop Stand",                 price: 89.99,  img: "/images/product-3.2.jpg",        category: "Stands"    },
    { id: 4,  name: "Double Standing Desk",         price: 69.99,  img: "/images/product-4.2.jpg",        category: "Desks"     },
    { id: 5,  name: "Wireless Charging Dock",       price: 89.99,  img: "/images/product-5.2.jpg",        category: "Accessories"},
    { id: 6,  name: "Ergonomic Headrest",           price: 79.99,  img: "/images/product-6.2.jpg",        category: "Chairs"    },
    { id: 7,  name: "Hybrid Laptop Sleeve",         price: 79.99,  img: "/images/product-7.2.jpg",        category: "Accessories"},
    { id: 8,  name: "Wireless Charging Tray",       price: 69.99,  img: "/images/product-8.2.jpg",        category: "Accessories"},
    { id: 9,  name: "Softside Chair",               price: 79.99,  img: "/images/product-10.2.jpg",       category: "Chairs"    },
    { id: 10, name: "Duo Standing Desk",            price: 69.99,  img: "/images/product-9.1.jpg",        category: "Desks"     },
];

const featuredKeywords = ["Chair", "Desk", "Laptop Stand", "Wireless", "Ergonomic", "Accessories"];

const SearchModal = ({ isOpen, onClose }) => {
    const [query, setQuery]       = useState('');
    const [results, setResults]   = useState([]);
    const [recent]                = useState(allProducts.slice(0, 4));
    const inputRef                = useRef(null);

    // focus input when modal opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setQuery('');
            setResults([]);
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // live search
    useEffect(() => {
        if (query.trim().length === 0) { setResults([]); return; }
        const q = query.toLowerCase();
        const found = allProducts.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
        setResults(found);
    }, [query]);

    const handleKeyword = (kw) => setQuery(kw);

    const handleClose = () => { onClose(); };

    // close on Escape
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape') handleClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [handleClose]);

    if (!isOpen) return null;

    const displayProducts = query.trim() ? results : recent;
    const sectionLabel    = query.trim()
        ? `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
        : 'Recently Viewed Products';

    return (
        <div className="search-backdrop" onClick={handleClose}>
            <div className="search-modal" onClick={(e) => e.stopPropagation()}>

                {/* ── Header ── */}
                <div className="search-header">
                    <span className="search-label">Search</span>
                    <button className="search-close-btn" onClick={handleClose}>
                        <X size={22} />
                    </button>
                </div>

                {/* ── Input ── */}
                <div className="search-input-wrap">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Searching..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="search-input"
                    />
                    <Search size={20} className="search-icon-right" />
                </div>

                {/* ── Featured Keywords ── */}
                {!query && (
                    <div className="search-keywords">
                        <p className="search-section-title">Feature keywords Today</p>
                        <div className="keywords-row">
                            {featuredKeywords.map((kw) => (
                                <button
                                    key={kw}
                                    className="keyword-chip"
                                    onClick={() => handleKeyword(kw)}
                                >
                                    {kw}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* ── Products ── */}
                <div className="search-products">
                    <div className="search-products-header">
                        <p className="search-section-title">{sectionLabel}</p>
                        {!query && (
                            <a href="/products" className="search-view-all" onClick={handleClose}>
                                View all <ArrowUpRight size={14} />
                            </a>
                        )}
                    </div>

                    {query && results.length === 0 ? (
                        <div className="search-no-results">
                            <p>No products found for "<strong>{query}</strong>"</p>
                            <span>Try different keywords</span>
                        </div>
                    ) : (
                        <div className="search-products-grid">
                            {displayProducts.map((product) => (
                                <div key={product.id} className="search-product-card" onClick={handleClose}>
                                    <div className="search-product-img">
                                        <img
                                            src={product.img}
                                            alt={product.name}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Product'; }}
                                        />
                                    </div>
                                    <div className="search-product-info">
                                        <p className="search-product-category">{product.category}</p>
                                        <h4 className="search-product-name">{product.name}</h4>
                                        <span className="search-product-price">${product.price}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SearchModal;