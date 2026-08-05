import React, { useState } from "react";
import axios from "axios";
import "../css/ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [serverOtp, setServerOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                "http://localhost:5555/user/send-otp",
                { email }
            );
            if (response.data.success) {
                setServerOtp(response.data.otp);
                setStep(2);
                toast.success("OTP sent to your email! Check inbox.");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Something went wrong! Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp === serverOtp) {
            setStep(3);
            toast.success("OTP verified! Set your new password.");
        } else {
            toast.error("Invalid OTP. Please try again.");
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post("http://localhost:5555/user/reset-password", {
                email: email,
                password: newPassword,
            });

            if (response.data.success) {
                toast.success("Password updated successfully!");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                toast.error(response.data.message || "Update failed. Try again.");
            }

        } catch (error) {
            console.error(error);
            toast.error("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            {step === 1 && (
                <form className="login-form" onSubmit={handleSendOtp}>
                    <h2>Forgot Password</h2>
                    <p style={{ fontSize: '12px', color: '#333', textAlign: 'center' }}>
                        Enter your email to receive an OTP.
                    </p>
                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                    <p><a href="/login">Back to Login</a></p>
                </form>
            )}

            {step === 2 && (
                <form className="login-form" onSubmit={handleVerifyOtp}>
                    <h2>Verify OTP</h2>
                    <p style={{ fontSize: '12px', color: '#333', textAlign: 'center' }}>
                        Enter the 6-digit code sent to your email.
                    </p>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={6}
                        required
                    />
                    <button type="submit">Verify OTP</button>
                    <button type="button" onClick={() => setStep(1)}
                        style={{ background: 'none', color: '#333', marginTop: '-10px' }}>
                        Back
                    </button>
                </form>
            )}

            {step === 3 && (
                <form className="login-form" onSubmit={handleResetPassword}>
                    <h2>New Password</h2>

                    <div style={{ position: 'relative' }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            style={{ width: '100%', paddingRight: '45px' }}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: 'absolute', right: '12px', top: '50%',
                                transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '18px'
                            }}
                        >
                            {showPassword ? "X" : "O"}
                        </span>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <input
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            style={{ width: '100%', paddingRight: '45px' }}
                        />
                        <span
                            onClick={() => setShowConfirm(!showConfirm)}
                            style={{
                                position: 'absolute', right: '12px', top: '50%',
                                transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '18px'
                            }}
                        >
                            {showConfirm ? "X" : "O"}
                        </span>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </button>
                </form>
            )}
        </div>
    );
};

export default ForgotPassword;