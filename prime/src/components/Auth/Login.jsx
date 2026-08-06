import React, { useState } from "react";
import axios from "axios";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Login() {
    const navigate = useNavigate();
    const [data, setData]       = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        localStorage.clear();

        try {
            const response = await axios.post("https://prime-interior-backend.onrender.com/user/login", data);
            const result   = response.data;

            if (result.status === 400 || !result.body) {
                toast.error(result.message || "Invalid credentials!");
                setLoading(false);
                return;
            }

            const userData  = result.body.data;
            const userRole  = userData?.role  || userData?.data?.role  || "";
            const userEmail = data.email.trim().toLowerCase();
            const firstName = userData?.firstName || userData?.data?.firstName || "";
            const lastName  = userData?.lastName  || userData?.data?.lastName  || "";

            if (userRole === "admin" && userEmail === "primeinterior101@gmail.com") {
                // ✅ Authorized Admin
                toast.success("Welcome Admin! Redirecting to Admin Panel... 🔐");
                localStorage.setItem("adminLoggedIn", "true");
                localStorage.setItem("userRole",      userRole);
                localStorage.setItem("userEmail",     userEmail);
                window.dispatchEvent(new Event("storage"));

                const authData = encodeURIComponent(JSON.stringify({
                    email: userEmail, role: userRole, firstName, lastName,
                }));
                setTimeout(() => {
                   window.location.replace(`https://prime-interior-admin.vercel.app?auth=${authData}`);
                }, 800);

            } else if (userRole === "admin") {
                // ✅ Koi hor admin role wala — access nahi
                toast.error("You don't have access to login as an Admin! 🚫");
                localStorage.clear();
                setLoading(false);

            } else {
                // ✅ Normal user
                localStorage.setItem("user",      JSON.stringify(userData));
                localStorage.setItem("userEmail", userEmail);
                localStorage.setItem("userRole",  userRole);
                localStorage.setItem("firstName", firstName);
                localStorage.setItem("lastName",  lastName);
                window.dispatchEvent(new Event("storage"));

                toast.success(result.message || "Login Successful! 🎉");
                setTimeout(() => navigate("/", { replace: true }), 800);
            }

        } catch (error) {
            console.error("Login error:", error);
            toast.error("Invalid Email or Password ❌");
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>LOGIN</h2>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={data.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={data.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? "Logging in..." : "LOGIN"}
                </button>
                <p className="forgot-password">
                    <span onClick={() => navigate("/forgot-password")} style={{ cursor: "pointer" }}>
                        Forgot Password?
                    </span>
                </p>
                <p className="signup-link">
                    Don't have an account?{" "}
                    <span onClick={() => navigate("/signup")} style={{ cursor: "pointer", fontWeight: "bold" }}>
                        Sign Up
                    </span>
                </p>
            </form>
        </div>
    );
}

export default Login;