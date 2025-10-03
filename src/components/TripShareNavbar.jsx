import { NavLink, useNavigate } from "react-router-dom";
import "./TripShareNavbar.css";

export default function TripShareNavbar() {
  const navigate = useNavigate();

  // Comprobamos si el usuario está logueado
  const isLoggedIn = !!localStorage.getItem("authToken");

  // Función de logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    navigate("/"); // redirige al home
  };

  return (
    <nav className="navbar">
      {/* Logo a la izquierda */}
      <button
        className="tm-brand"
        onClick={() => navigate("/")}
        aria-label="Home"
      >
        <img
          src="../assets/tripSharelogo.png"
          alt="Trip Match logo"
          className="tm-brand-pin"
        />
      </button>

      {/* Menú de navegación */}
      <div className="navbar-menu">
        <NavLink to="/destinations" className="nav-btn">
          Destinations
        </NavLink>
        <NavLink to="/reviews" className="nav-btn">
          Reviews
        </NavLink>

        {/* Favorites solo si está logueado */}
        {isLoggedIn && (
          <NavLink to="/favourites" className="nav-btn">
            ⭐ Favourites
          </NavLink>
        )}

        {/* Sign Up / Login solo si NO está logueado */}
        {!isLoggedIn && (
          <>
            <NavLink to="/signup" className="nav-btn">
              Sign Up
            </NavLink>
            <NavLink to="/login" className="nav-btn">
              Login
            </NavLink>
          </>
        )}

        {/* Logout solo si está logueado */}
        {isLoggedIn && (
          <button onClick={handleLogout} className="nav-btn">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
