import React from 'react';
import Navbar from '../common/Navbar'; // Adjust the path if necessary
import '../user/Homepage.css'; // Create and import a CSS file for styling

const Homepage = () => {
  // Mock Data for Products
  const products = [
    { id: 1, name: "Ergonomic Chair Pro", price: 79.99, img: "chair1.jpg", discount: 25 },
    { id: 2, name: "Open Box - Adjustable Laptop Stand", price: 79.99, oldPrice: 98.00, img: "stand.jpg", discount: 25 },
    { id: 3, name: "Laptop Stand", price: 89.99, oldPrice: 98.00, img: "stand2.jpg", discount: 25 },
    { id: 4, name: "Double Standing Desk", price: 69.99, img: "desk.jpg", discount: null }
  ];

  return (
    <div className="homepage">
      {/* 1. Navbar is outside the main content padding */}
      <Navbar />

      <main className="content-wrapper">
        
        {/* 2. HERO SLIDER */}
        <section className="hero-banner">
          <div className="hero-image-container">
            <div className="hero-text-overlay">
              <h2>Ergonomic Chair Pro</h2>
              <p>Get superior support and better posture with ergonomic chairs for long work hours</p>
              <button className="btn-explore">Explore Collection <span>&nearr;</span></button>
            </div>
            <div className="slider-controls">
                <button className="arrow-btn">❮</button>
                <button className="arrow-btn">❯</button>
            </div>
            <div className="dots">
                <span className="dot active"></span>
                <span className="dot"></span>
                <span className="dot"></span>
            </div>
          </div>
        </section>

        {/* 3. CATEGORIES GRID */}
        <section className="categories-section">
          <div className="cat-row">
            <div className="cat-item">
              <div className="pill-img"><img src="storage.jpg" alt="" /></div>
              <span className="cat-title">Storage Solutions</span>
            </div>
            <div className="cat-item">
              <div className="pill-img"><img src="lighting.jpg" alt="" /></div>
              <span className="cat-title">Lighting</span>
            </div>
          </div>
          <div className="cat-row offset">
            <div className="cat-item">
              <div className="pill-img"><img src="chairs.jpg" alt="" /></div>
              <span className="cat-title">Office Chairs</span>
            </div>
            <div className="cat-item">
              <div className="pill-img"><img src="accessories.jpg" alt="" /></div>
              <span className="cat-title">Accessories</span>
            </div>
          </div>
          <div className="view-all-container">
            <a href="#" className="view-all-link">View All Categories</a>
          </div>
        </section>

        <hr className="divider" />

        {/* 4. OUR PICKS SECTION */}
        <section className="picks-section">
          <div className="section-header">
            <h2>Our Picks For You</h2>
            <p>Fresh styles just in! Elevate your look.</p>
          </div>

          <div className="product-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-thumb">
                  {product.discount && <span className="badge">-{product.discount}%</span>}
                  <img src={product.img} alt={product.name} />
                </div>
                <div className="product-details">
                  <h3>{product.name}</h3>
                  <p className="price-tag">
                    {product.oldPrice && <span className="old">${product.oldPrice}</span>}
                    ${product.price}
                  </p>
                  <div className="color-dots">
                    <span className="c-dot blue"></span>
                    <span className="c-dot white"></span>
                    <span className="c-dot gray"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
      </main>

      {/* Floating Back to Top Button */}
      <button className="back-to-top">↑</button>
    </div>
  );
};

export default Homepage;