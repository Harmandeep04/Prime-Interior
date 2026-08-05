import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Eye, SlidersHorizontal, LayoutGrid, Grid2X2, Grid3X3, X, Star, Minus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import axios from "axios";
import { toast } from "react-toastify";
import "./css/Productspage.css";

// ─────────────────────────────────────────────
// Quick View Modal
// ─────────────────────────────────────────────
const QuickViewModal = ({ product, onClose, onAddToCart, wishlistCtx }) => {
  const [color, setColor] = useState(product.colors?.[0] || '#c9b8a8');
  const [size,  setSize]  = useState('Size A - Small');
  const [qty,   setQty]   = useState(1);
  const [added, setAdded] = useState(false);
  const navigate          = useNavigate();
  const { addToCart }     = useCart();

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleAdd = () => {
    const isLoggedIn = !!localStorage.getItem("user"); // ✅ Fixed
    if (!isLoggedIn) { onClose(); navigate('/login'); return; }
    onAddToCart({ ...product, color, size, qty });
    setAdded(true);
    setTimeout(() => { setAdded(false); onClose(); }, 800);
  };

  const handleBuyNow = () => {
    const isLoggedIn = !!localStorage.getItem("user"); // ✅ Fixed
    if (!isLoggedIn) { onClose(); navigate('/login'); return; }
    addToCart({ ...product, color, size, qty });
    onClose();
    navigate('/shopping-cart');
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    const isLoggedIn = !!localStorage.getItem("user"); // ✅ Fixed
    if (!isLoggedIn) {
      toast.info('Please login first to add to wishlist! ❤️');
      onClose();
      navigate('/login');
      return;
    }
    wishlistCtx?.toggleWishlist(product);
  };

  const colors = product.colors?.length ? product.colors : ['#c9b8a8', '#888', '#555'];
  const liked  = wishlistCtx?.isWishlisted
    ? wishlistCtx.isWishlisted(product.id || product._id)
    : false;

  return (
    <div className="hp-qv-overlay" onClick={onClose}>
      <div className="hp-qv-panel" onClick={e => e.stopPropagation()}>
        <button className="hp-qv-close" onClick={onClose}><X size={22} /></button>
        <div className="hp-qv-body">

          <div className="hp-qv-images">
            <img
              src={product.img || product.image}
              alt={product.name}
              className="hp-qv-main"
              onError={e => { e.target.src = 'https://via.placeholder.com/400'; }}
            />
            {(product.hoverImg || product.hoverImage) && (
              <img
                src={product.hoverImg || product.hoverImage}
                alt=""
                className="hp-qv-thumb"
                onError={e => { e.target.src = 'https://via.placeholder.com/100'; }}
              />
            )}
          </div>

          <div className="hp-qv-info">
            <p className="hp-qv-label">Quick View</p>
            <h3>{product.name}</h3>

            <div className="hp-qv-meta">
              <div className="hp-qv-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14}
                    fill={i < 4 ? '#f5a623' : 'none'}
                    color={i < 4 ? '#f5a623' : '#ddd'} />
                ))}
                <span>(134 reviews)</span>
              </div>
              <span className="hp-qv-sold">18 sold in last 32 hours</span>
            </div>

            <div className="hp-qv-price-row">
              {product.discount ? (
                <>
                  <span className="hp-qv-old">
                    ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                  </span>
                  <span className="hp-qv-price">${product.price}</span>
                  <span className="hp-qv-disc">-{product.discount}%</span>
                </>
              ) : (
                <span className="hp-qv-price">${product.price}</span>
              )}
            </div>

            <p className="hp-qv-desc">
              {product.description || "Sustainable fibres, reducing environmental impact."}
            </p>
            <p className="hp-qv-viewers"><Eye size={14} /> 28 people are viewing this right now</p>

            <div className="hp-qv-section">
              <p>Colors: <strong>
                {colors.indexOf(color) === 0 ? 'Beige' :
                 colors.indexOf(color) === 1 ? 'Grey' : 'Dark'}
              </strong></p>
              <div className="hp-qv-colors">
                {colors.map((c, i) => (
                  <button key={i}
                    className={`hp-qv-swatch ${color === c ? 'active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setColor(c)} />
                ))}
              </div>
            </div>

            <div className="hp-qv-section">
              <p>Size: <strong>{size}</strong></p>
              <div className="hp-qv-sizes">
                {['Size A - Small', 'Size B - Medium'].map(s => (
                  <button key={s}
                    className={`hp-qv-size-btn ${size === s ? 'active' : ''}`}
                    onClick={() => setSize(s)}>{s}
                  </button>
                ))}
              </div>
            </div>

            <div className="hp-qv-section">
              <p>Quantity:</p>
              <div className="hp-qv-qty">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}><Minus size={14} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => q + 1)}><Plus size={14} /></button>
              </div>
            </div>

            <div className="hp-qv-actions">
              <button className={`hp-qv-atc ${added ? 'added' : ''}`} onClick={handleAdd}>
                {added ? `✓ Added  $${product.price}` : `Add To Cart  $${product.price}`}
              </button>
              <button className="hp-qv-icon-btn" onClick={handleWishlistClick}>
                <Heart size={18}
                  fill={liked ? '#e53e3e' : 'none'}
                  color={liked ? '#e53e3e' : '#333'} />
              </button>
            </div>
            <button className="hp-qv-buy-now" onClick={handleBuyNow}>Buy it now</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const SORT_OPTIONS = [
  { label: "Sort by (Default)",  value: "default"   },
  { label: "Price: Low to High", value: "price_asc"  },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Name: A–Z",          value: "name_asc"   },
];

const CATEGORIES = ["All", "Chairs", "Desks", "Stands", "Accessories"];

// ─────────────────────────────────────────────
// ProductsPage
// ─────────────────────────────────────────────
export default function ProductsPage() {
  const navigate      = useNavigate();
  const { addToCart } = useCart();
  const wishlistCtx   = useWishlist();

  // ✅ Backend products state
  const [products,         setProducts]         = useState([]);
  const [loading,          setLoading]          = useState(true);

  const [addedId,          setAddedId]          = useState(null);
  const [sort,             setSort]             = useState("default");
  const [saleOnly,         setSaleOnly]         = useState(false);
  const [category,         setCategory]         = useState("All");
  const [cols,             setCols]             = useState(4);
  const [filterOpen,       setFilterOpen]       = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // ✅ Backend se products fetch
  useEffect(() => {
    axios.get("http://localhost:5555/user/all-products")
      .then(res => {
        if (res.data.success) {
          const normalized = res.data.body.map(p => ({
            ...p,
            id:       p._id,
            img:      p.image      || "",
            hoverImg: p.hoverImage || "",
            colors:   p.colors?.length ? p.colors : ['#c9b8a8', '#888', '#555'],
            discount: p.discount   || 0,
          }));
          setProducts(normalized);
        }
      })
      .catch(err => {
        console.error("Products fetch error:", err);
        toast.error("Could not load products ❌");
      })
      .finally(() => setLoading(false));
  }, []);

  const isWishlisted = (id) => {
    if (!localStorage.getItem("user")) return false; // ✅ Fixed
    return wishlistCtx?.isWishlisted ? wishlistCtx.isWishlisted(id) : false;
  };

  const handleAddToCart = (product) => {
    const isLoggedIn = !!localStorage.getItem("user"); // ✅ Fixed
    if (!isLoggedIn) { navigate("/login"); return; }
    addToCart({ ...product, qty: product.qty || 1 });
    setAddedId(product.id || product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  // ✅ Wishlist toggle — login check
  const handleWishlistToggle = (e, product) => {
    e.stopPropagation();
    const isLoggedIn = !!localStorage.getItem("user"); // ✅ Fixed
    if (!isLoggedIn) {
      toast.info('Please login first to add to wishlist! ❤️');
      navigate('/login');
      return;
    }
    wishlistCtx?.toggleWishlist(product);
  };

  // ✅ Filter + Sort
  let displayed = [...products];
  if (saleOnly)           displayed = displayed.filter(p => p.discount > 0);
  if (category !== "All") displayed = displayed.filter(p => p.category === category);
  if (sort === "price_asc")  displayed.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") displayed.sort((a, b) => b.price - a.price);
  if (sort === "name_asc")   displayed.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="pp-wrapper">

      {/* ── HERO BANNER ── */}
      <div className="pp-hero">
        <h1>Shop</h1>
        <p className="pp-breadcrumb">
          <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Homepage</span>
          {" › "} Shop
        </p>
      </div>

      {/* ── TOOLBAR ── */}
      <div className="pp-toolbar">
        <div className="pp-toolbar-left">
          <button className="pp-filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
            <SlidersHorizontal size={16} /> Filters
          </button>
          <label className="pp-sale-toggle">
            <input type="checkbox" checked={saleOnly}
              onChange={e => setSaleOnly(e.target.checked)} />
            <span className="pp-sale-check" />
            Shop sale items only
          </label>
        </div>

        <div className="pp-toolbar-center">
          <button className={`pp-grid-btn ${cols === 2 ? "active" : ""}`}
            onClick={() => setCols(2)} title="2 columns">
            <LayoutGrid size={18} />
          </button>
          <button className={`pp-grid-btn ${cols === 3 ? "active" : ""}`}
            onClick={() => setCols(3)} title="3 columns">
            <Grid2X2 size={18} />
          </button>
          <button className={`pp-grid-btn ${cols === 4 ? "active" : ""}`}
            onClick={() => setCols(4)} title="4 columns">
            <Grid3X3 size={18} />
          </button>
        </div>

        <div className="pp-toolbar-right">
          <span className="pp-sort-label">Sort by:</span>
          <select className="pp-sort-select" value={sort}
            onChange={e => setSort(e.target.value)}>
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── FILTER DRAWER ── */}
      {filterOpen && (
        <div className="pp-filter-drawer">
          <p className="pp-filter-title">Category</p>
          <div className="pp-cat-pills">
            {CATEGORIES.map(c => (
              <button key={c}
                className={`pp-cat-pill ${category === c ? "active" : ""}`}
                onClick={() => setCategory(c)}>{c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── PRODUCT GRID ── */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          Loading products...
        </p>
      ) : displayed.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
          No products found.
        </p>
      ) : (
        <div className={`pp-grid pp-cols-${cols}`}>
          {displayed.map((product, index) => {
            const pid   = product.id || product._id;
            const liked = isWishlisted(pid);
            return (
              <motion.div key={pid} className="pp-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.45 }}
              >
                <div className="pp-card-img-wrap">
                  {product.discount > 0 && (
                    <span className="pp-badge">-{product.discount}%</span>
                  )}
                  <img
                    src={product.img || product.image}
                    alt={product.name}
                    className="pp-img pp-img-primary"
                    onError={e => { e.target.src = 'https://via.placeholder.com/300'; }}
                  />
                  {(product.hoverImg || product.hoverImage) && (
                    <img
                      src={product.hoverImg || product.hoverImage}
                      alt={product.name}
                      className="pp-img pp-img-hover"
                      onError={e => { e.target.src = 'https://via.placeholder.com/300'; }}
                    />
                  )}

                  {/* ✅ Wishlist + Quick View — login check */}
                  <div className="pp-icons">
                    <button
                      className={`pp-icon-btn ${liked ? "pp-wishlisted" : ""}`}
                      onClick={(e) => handleWishlistToggle(e, product)}
                      title="Wishlist"
                    >
                      <Heart size={16}
                        fill={liked ? "#e53e3e" : "none"}
                        color={liked ? "#e53e3e" : "#333"} />
                    </button>
                    <button className="pp-icon-btn" title="Quick View"
                      onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}>
                      <Eye size={16} />
                    </button>
                  </div>

                  {/* ✅ Add To Cart — login check */}
                  <button
                    className={`pp-atc ${addedId === pid ? "pp-atc-added" : ""}`}
                    onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}
                  >
                    {addedId === pid ? "✓ Added!" : "Add To Cart"}
                  </button>
                </div>

                <div className="pp-card-info">
                  <h3 className="pp-name">{product.name}</h3>
                  <div className="pp-price-row">
                    {product.discount > 0 ? (
                      <>
                        <span className="pp-old-price">
                          ${(product.price / (1 - product.discount / 100)).toFixed(2)}
                        </span>
                        <span className="pp-price">${product.price}</span>
                      </>
                    ) : (
                      <span className="pp-price">${product.price}</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Quick View Modal ── */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCart}
          wishlistCtx={wishlistCtx}
        />
      )}
    </div>
  );
}