import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/Shop.css";

export const Shop = () => {
    const [products, setProducts] = useState([]); // Database ton aaun wale products
    const [showPopup, setShowPopup] = useState(false);
    const [loading, setLoading] = useState(true); // Loading state
    
    const navigate = useNavigate();
    const location = useLocation();

    // URL ton search term mangvaun lyi (e.g., ?search=chair)
    const searchQuery = new URLSearchParams(location.search).get("search");

    useEffect(() => {
        // 1. Auth Check for Popup
        const user = localStorage.getItem("user");
        if (!user) {
            const timer = setTimeout(() => setShowPopup(true), 1500);
            return () => clearTimeout(timer);
        }

        // 2. Fetch Products from Backend
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = "http://localhost:5555/user/all-products";
                
                // Agar URL vich search term hai, taan search API call karo
                if (searchQuery) {
                    url = `http://localhost:5555/user/search?q=${searchQuery}`;
                }

                const response = await axios.get(url);
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [searchQuery]); // Jadon vi search badlega, products dubara load honge

    return (
        <div className="shop-page">
            <header className="shop-header">
                <h1>{searchQuery ? `Results for "${searchQuery}"` : "Our Collection"}</h1>
                <p>Premium furniture for your workspace</p>
            </header>

            {loading ? (
                <div className="loading-container">
                    <p>Loading Products...</p>
                </div>
            ) : (
                <div className="product-grid">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product._id} className="product-card">
                                <div className="product-image">
                                    {/* Agar image path database vich '/images/chair.jpg' hai 
                                        taan eh public folder ton apne aap chak lavega */}
                                    <img src={product.image} alt={product.name} />
                                    <button className="add-to-cart">Add to Cart</button>
                                </div>
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <p>₹{product.price}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-products">
                            <p>No products found. Try a different search!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Auth Modal Popup */}
            {showPopup && (
                <div className="modal-overlay">
                    <div className="modal-content glass-effect">
                        <h2>Join Prime Interior</h2>
                        <p>Create an account to save items to your cart and enjoy member-only discounts!</p>
                        <div className="modal-actions">
                            <button className="main-btn" onClick={() => navigate("/signup")}>
                                Create Account
                            </button>
                            <button className="secondary-btn" onClick={() => navigate("/login")}>
                                Already have an account? Login
                            </button>
                        </div>
                        <button className="close-text-btn" onClick={() => setShowPopup(false)}>
                            Continue as Guest
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

