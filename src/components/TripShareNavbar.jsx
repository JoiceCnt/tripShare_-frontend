// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // carregar usuário logado (simples: nome salvo no localStorage)
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    localStorage.removeItem("user"); // remove user
    setUser(null);
    navigate("/login"); // redireciona para login
  };

  return (
    <nav style={{ background: "#90a4ae", padding: "10px" }}>
      <Link to="/">Home</Link> | <Link to="/destinations">Destinations</Link> |{" "}
      <Link to="/reviews">Reviews</Link> |{" "}
      {!user ? (
        <>
          <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
        </>
      ) : (
        <>
          <span style={{ fontWeight: "bold" }}>Olá, {user.name}</span> |{" "}
          <button onClick={handleLogout} style={{ cursor: "pointer" }}>
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
