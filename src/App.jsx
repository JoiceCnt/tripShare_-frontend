// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DestinationsPage from "./pages/DestinationsPage";
import ReviewsPage from "./pages/ReviewsPage";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Home</Link> |<Link to="/signup">Signup</Link> |
        <Link to="/login">Login</Link> |<Link to="/destinations">Destinos</Link>{" "}
        |<Link to="/reviews">Reviews</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
