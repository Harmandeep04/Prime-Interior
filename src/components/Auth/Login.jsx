import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login({ setCurrentUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) return alert("Invalid credentials");

    localStorage.setItem("currentUser", JSON.stringify(user));
    setCurrentUser(user);
    
    if (user.role === "designer") navigate("/dashboard");
    else navigate("/home");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back to Prime interior</h2>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Login</button>
        <p>New to Prime interior? <Link to="/signup">Sign up</Link></p>
      </div>
    </div>
  );
}