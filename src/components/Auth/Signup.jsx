import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const exists = users.find((u) => u.email === email);
    if (exists) return alert("User already exists");

    const newUser = { name, email, password, role };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));
    alert("Signup successful! Please login.");
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <div className="role-toggle">
          <button className={role === "user" ? "active" : ""} onClick={() => setRole("user")}>User</button>
          <button className={role === "designer" ? "active" : ""} onClick={() => setRole("designer")}>Designer</button>
        </div>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSignup}>Sign Up</button>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}