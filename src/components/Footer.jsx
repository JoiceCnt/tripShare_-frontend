import { NavLink } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <nav className="footer-nav">
        <NavLink to="/contact" className="footer-link">
          Contact Us
        </NavLink>
        <NavLink to="/policy" className="footer-link">
          Policy
        </NavLink>
        <NavLink to="/about" className="footer-link">
          About Us
        </NavLink>
      </nav>
    </footer>
  );
}
