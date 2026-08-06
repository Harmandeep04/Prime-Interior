import React, { useState } from "react";
import axios from "axios";
import "../css/Signup.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Signup() {
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName:  "",
    email:     "",
    password:  "",
    role:      "user",
  });

  const [enteredOtp,  setEnteredOtp]  = useState("");
  const [otpSent,     setOtpSent]     = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpLoading,  setOtpLoading]  = useState(false);
  const [emailLocked, setEmailLocked] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const isValidEmailFormat = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // ✅ OTP Send
  const handleSendOtp = async () => {
    if (!isValidEmailFormat(data.email)) {
      toast.error("Please enter a valid email address ❌");
      return;
    }
    setOtpLoading(true);
    try {
      const response = await axios.post(
        "https://prime-interior-backend.onrender.com/user/send-signup-otp",
        { email: data.email }
      );
      if (response.data.success) {
        setOtpSent(true);
        setEmailLocked(true);
        toast.success("OTP sent to your email! Check inbox 📧");
      } else {
        toast.error(response.data.message || "Failed to send OTP ❌");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Check your email ❌");
    } finally {
      setOtpLoading(false);
    }
  };

  // ✅ OTP Verify
  const handleVerifyOtp = async () => {
    if (!enteredOtp) {
      toast.error("Please enter the OTP ❌");
      return;
    }
    try {
      const response = await axios.post(
        "https://prime-interior-backend.onrender.com/user/verify-signup-otp",
        { email: data.email, otp: enteredOtp }
      );
      if (response.data.success) {
        setOtpVerified(true);
        toast.success("Email verified successfully! ✅");
      } else {
        toast.error(response.data.message || "Invalid OTP ❌");
      }
    } catch (error) {
      toast.error("OTP verification failed ❌");
    }
  };

  // ✅ Final Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otpVerified) {
      toast.warning("Please verify your email first! 📧");
      return;
    }

    const submitData = { ...data, role: "user" };

    try {
      const response = await axios.post(
        "https://prime-interior-backend.onrender.com/user/signup",
        submitData
      );
      const result = response.data;

      if (result.success === false) {
        toast.warning(result.message || "Signup failed ⚠️");
        return;
      }

      toast.success(result.message || "Account Created! Please login 🎉");
      setData({ firstName: "", lastName: "", email: "", password: "", role: "user" });
      setTimeout(() => navigate("/login"), 1000);

    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("Signup failed. Please try again ❌");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>CREATE ACCOUNT</h2>

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={data.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={data.lastName}
          onChange={handleChange}
          required
        />

        {/* ✅ Email + Send OTP */}
        <div className="email-otp-wrapper">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={data.email}
            onChange={handleChange}
            required
            disabled={emailLocked}
            style={{
              borderColor:     otpVerified ? "#22c55e" : "",
              backgroundColor: emailLocked  ? "#f9f9f9" : "",
            }}
          />
          {!otpVerified && (
            <button
              type="button"
              className="send-otp-btn"
              onClick={handleSendOtp}
              disabled={otpLoading || otpSent}
            >
              {otpLoading ? "Sending..." : otpSent ? "OTP Sent ✅" : "Send OTP"}
            </button>
          )}
          {otpVerified && (
            <span className="verified-badge">✅ Verified</span>
          )}
        </div>

        {/* ✅ OTP Input */}
        {otpSent && !otpVerified && (
          <div className="otp-verify-wrapper">
            <input
              type="text"
              placeholder="Enter OTP"
              value={enteredOtp}
              onChange={(e) => setEnteredOtp(e.target.value)}
              maxLength={6}
              style={{ letterSpacing: "4px", textAlign: "center" }}
            />
            <button
              type="button"
              className="verify-otp-btn"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </div>
        )}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={data.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="signup-btn"
          disabled={!otpVerified}
          style={{
            opacity: otpVerified ? 1 : 0.5,
            cursor:  otpVerified ? "pointer" : "not-allowed",
          }}
        >
          SIGN UP
        </button>

        <p className="login-link">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ cursor: "pointer", fontWeight: "bold" }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}