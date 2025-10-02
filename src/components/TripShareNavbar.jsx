// src/components/TripShareNavbar.jsx
import { NavLink } from "react-router-dom";

export default function TripShareNavbar({ isLoggedIn, onLogout }) {
  return (
    <nav style={{ padding: "10px", background: "#8BAAAD" }}>
      <NavLink to="/">Home</NavLink>
      {" | "}
      <NavLink to="/destinations">Destinations</NavLink>
      {" | "}
      <NavLink to="/reviews">Reviews</NavLink>
      {" | "}

      {isLoggedIn ? (
        <>
          <button
            onClick={onLogout}
            style={{
              marginLeft: "10px",
              background: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
          {" | "}
          <NavLink to="/profile">Profile</NavLink>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          {" | "}
          <NavLink to="/signup">Sign Up</NavLink>
        </>
      )}
    </nav>
  );
}
