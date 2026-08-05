import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Homepage from "./components/User/Homepage";
import { Signup } from "./components/Auth/Signup";
import { Footer } from "./components/Common/Footer";
import ForgotPassword from "./components/Auth/ForgotPassword";
import About from "./pages/About";
import LivingRoom from "./pages/LivingRoom";
import ModularKitchen from "./pages/ModularKitchen";
import BedroomDesign from "./pages/BedroomDesign";
import HomeOffice from "./pages/HomeOffice";
import Contact from "./pages/Contact";
import Portfolio from "./pages/Portfolio";
import OurProcess from "./pages/OurProcess";
import GardenLandscape from "./pages/GardenLandscape";
import TerraceDesign from "./pages/TerraceDesign";
import BalconyMakeover from "./pages/BalconyMakeover";
import ExteriorElevation from "./pages/ExteriorElevation";
import FullRenovation from "./pages/FullRenovation";
import CommercialDesign from "./pages/CommercialDesign";
import ColorConsultation from "./pages/ColorConsultation";
import LuxuryFurniture from "./pages/LuxuryFurniture";
import DesignerLighting from "./pages/DesignerLighting";
import WallDecor from "./pages/WallDecor";
import FlooringRugs from "./pages/FlooringRugs";
import ShoppingCart from "./pages/ShoppingCart";
import Checkout from "./pages/Checkout";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import MyOrders from "./components/User/MyOrders";
import MyProfilee from "./components/User/MyProfilee";
import Navbar from "./components/Common/Navbar";
import Login from "./components/Auth/Login";
import { WishlistProvider } from "./context/WishlistContext";
import WishlistPage from "./pages/Wishlist";
import ProductsPage from "./pages/Productspage";
import ScrollToTop from "./ScrollToTop";

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="app-layout">
              <Navbar />
              <main className="page-content">
                <ScrollToTop />
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/shopping-cart" element={<ShoppingCart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/my-orders" element={<MyOrders />} />
                  <Route path="/profile" element={<MyProfilee />} />
                  <Route path="/Products" element={<ProductsPage />} />
                  <Route path="/living-room" element={<LivingRoom />} />
                  <Route path="/modular-kitchen" element={<ModularKitchen />} />
                  <Route path="/bedroom-design" element={<BedroomDesign />} />
                  <Route path="/home-office" element={<HomeOffice />} />
                  <Route path="/garden-landscape" element={<GardenLandscape />} />
                  <Route path="/terrace-design" element={<TerraceDesign />} />
                  <Route path="/balcony-makeover" element={<BalconyMakeover />} />
                  <Route path="/exterior-elevation" element={<ExteriorElevation />} />
                  <Route path="/full-renovation" element={<FullRenovation />} />
                  <Route path="/commercial-design" element={<CommercialDesign />} />
                  <Route path="/color-consultation" element={<ColorConsultation />} />
                  <Route path="/luxury-furniture" element={<LuxuryFurniture />} />
                  <Route path="/designer-lighting" element={<DesignerLighting />} />
                  <Route path="/wall-decor" element={<WallDecor />} />
                  <Route path="/flooring-rugs" element={<FlooringRugs />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/our-process" element={<OurProcess />} />
                  
                </Routes>
              </main>
              <Footer />
              <ToastContainer position="top-right" autoClose={3000} />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;