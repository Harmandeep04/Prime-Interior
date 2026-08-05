import React, { useState } from 'react';
import { FaFacebookF, FaInstagram, FaRegPaperPlane, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter, FaPinterest } from 'react-icons/fa6';
import axios from 'axios';
import { toast } from 'react-toastify';
import './Footer.css';

export const Footer = () => {
  const [review, setReview] = useState({
    name: "",
    rating: 5,
    comment: "",
  });

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!review.name || !review.comment) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      // 1. Postman vangu data bhej rhe aa
      const response = await axios.post("http://localhost:5555/user/add-review", review, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Response from Server:", response.data);

      // Tuhade backend controller vich 'success: true' return hunda hai
      if (response.data.success) {
        toast.success("Review submitted! Thank you 🌟");
        // Form nu khali krn lyi
        setReview({ name: "", rating: 5, comment: "" });
        
        // OPTIONAL: Je tusi chaunde ho k bina page refresh kite Homepage te review ose vele dikhe
        // window.location.reload(); 
      } else {
        toast.error(response.data.message || "Failed to add review.");
      }
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Server connection error! Check if backend is running.");
    }
  };

  return (
    <footer className="footer-main">
      <div className="footer-container">

        {/* Left: Information */}
        <div className="footer-col">
          <h3>Information</h3>
          <ul>
            <li>About Us</li>
            <li>Our Portfolio</li>
            <li>Design Process</li>
            <li>Contact Us</li>
          </ul>
          <div className="contact-info">
            <p className="phone"><FaPhoneAlt  size={14} style={{marginRight: '8px'}}/>+91 98765 43210</p>
            <p className="email"><FaEnvelope size={14} style={{marginRight: '8px'}}/>hello@primeinterior.in</p>
           
          </div>

          {/* Social Links */}
          <div className="social-links" style={{marginTop: '25px'}}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebookF /></a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaXTwitter /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram /></a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer"><FaPinterest /></a>
            <a href="mailto:hello@primeinterior.in"><FaRegPaperPlane /></a>
          </div>
        </div>

        {/* Center: Our Services */}
        <div className="footer-col">
          <h3>Our Services</h3>
          <ul>
            <li>Interior Design</li>
            <li>Exterior Design</li>
            <li>Home Renovation</li>
            <li>Color Consultation</li>
            <li>Return & Refund</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Right: Review Form */}
        <div className="footer-newsletter">
          <h2>Share Your Experience With Us</h2>
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <input
              type="text"
              name="name" // ← Zaroori hai backend schema naal match krn lyi
              placeholder="Your Name"
              value={review.name}
              onChange={(e) => setReview({ ...review, name: e.target.value })}
              required
            />
            <select
              name="rating"
              value={review.rating}
              onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
            >
              <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
              <option value={4}>⭐⭐⭐⭐ Very Good</option>
              <option value={3}>⭐⭐⭐ Good</option>
              <option value={2}>⭐⭐ Fair</option>
              <option value={1}>⭐ Poor</option>
            </select>
            <textarea
              name="comment" 
              placeholder="Share your experience with Prime Interior..."
              value={review.comment}
              onChange={(e) => setReview({ ...review, comment: e.target.value })}
              rows={4}
              required
            />
            <button type="submit" className="btn-subscribe">
              Submit Review ↗
            </button>
          </form>
        </div>

      </div>

      <div className="footer-brand-bottom">
        <p>© 2026 Prime Interior. All rights reserved. | Designed with ❤️ in Punjab, India</p>
      </div>
    </footer>
  );
};