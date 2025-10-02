// src/App.jsx
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import TripShareNavbar from "./components/TripShareNavbar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ReviewsPage from "./pages/ReviewsPage";
import DestinationsPage from "./pages/DestinationsPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  const navigate = useNavigate();

  // estado inicial: checa se já existe token salvo
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );

  const handleLogin = (token) => {
    localStorage.setItem("authToken", token);
    setIsLoggedIn(true);
    navigate("/"); // manda para Home
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/login"); // volta pro login
  };

  return (
    <>
      <TripShareNavbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
        <Route path="/reviews" element={<ReviewsPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
    </>
  );
}

export default App;
