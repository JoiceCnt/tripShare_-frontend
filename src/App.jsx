// src/App.jsx
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import TripShareNavbar from "./components/TripShareNavbar";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import ReviewsPage from "./pages/ReviewsPage";
import DestinationsPage from "./pages/DestinationsPage";
import SignUpPage from "./pages/SignUpPage";
import Footer from "./components/Footer";
import PolicyPage from "./pages/PolicyPage";
import AboutPage from "./pages/AboutPage";
import ContactUsPage from "./pages/ContactUsPage";

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
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/policy" element={<PolicyPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;
