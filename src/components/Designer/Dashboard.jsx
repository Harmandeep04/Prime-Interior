import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductUpload from "./ProductUpload";
import Inquiries from "./Inquiries";

export default function DesignerDashboard({ setCurrentUser }) {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("products");
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("designerProducts")) || [];
    setProducts(stored);
  }, []);

  const addProduct = (product) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const newProduct = { 
      ...product, 
      id: Date.now(),
      designerName: currentUser.name,
      designerEmail: currentUser.email
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem("designerProducts", JSON.stringify(updated));
    alert("Product uploaded successfully!");
  };

  const deleteProduct = (productId) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    localStorage.setItem("designerProducts", JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <div className="designer-dashboard">
      <nav className="navbar">
        <h1>Deccor Designer Studio</h1>
        <div className="nav-links">
          <button onClick={() => setActiveTab("products")}>Products</button>
          <button onClick={() => setActiveTab("upload")}>Upload New</button>
          <button onClick={() => setActiveTab("inquiries")}>Inquiries</button>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        {activeTab === "products" && (
          <div className="products-section">
            <h2>Your Products ({products.length})</h2>
            <div className="product-grid">
              {products.map((p) => (
                <div key={p.id} className="product-card">
                  <img src={p.image} alt={p.name} />
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="price">${p.price}</div>
                  <button className="delete-btn" onClick={() => deleteProduct(p.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "upload" && (
          <ProductUpload onUpload={addProduct} />
        )}

        {activeTab === "inquiries" && (
          <Inquiries />
        )}
      </div>
    </div>
  );
}