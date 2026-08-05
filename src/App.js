import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";

// Auth
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

// User & Designer
import Homepage from "./components/user/Homepage";
import DesignerDashboard from "./components/Designer/Dashboard";

// Common
import Navbar from "./components/common/Navbar"; 
import { Home } from "lucide-react";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  return (
    <>
    <Homepage/>
    </>          
  );
}

export default App;