import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [newReview, setNewReview] = useState({ country: "", text: "" });

  // Fetch reviews + countries
  useEffect(() => {
    axios
      .get(`${API_URL}/reviews`)
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Error fetching reviews:", err));

    axios
      .get(`${API_URL}/destinations/countries`)
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.country || !newReview.text) return;

    try {
      const res = await axios.post(`${API_URL}/reviews`, newReview);
      setReviews([res.data, ...reviews]); // adiciona no topo
      setNewReview({ country: "", text: "" });
    } catch (err) {
      console.error("Error creating review:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reviews</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select
          value={newReview.country}
          onChange={(e) =>
            setNewReview({ ...newReview, country: e.target.value })
          }
        >
          <option value="">Select a country</option>
          {countries.map((c) => (
            <option key={c.iso2} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <textarea
          placeholder="Write your review"
          value={newReview.text}
          onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
          style={{ marginLeft: "10px" }}
        />

        <button type="submit" style={{ marginLeft: "10px" }}>
          Submit Review
        </button>
      </form>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((rev, i) => (
            <li key={i}>
              <strong>{rev.country}:</strong> {rev.text}{" "}
              <em style={{ color: "gray", fontSize: "12px" }}>
                ({new Date(rev.createdAt).toLocaleDateString()})
              </em>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
