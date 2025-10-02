import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [newReview, setNewReview] = useState({ country: "", text: "" });
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [message, setMessage] = useState("");

  // Mock user (replace with real auth later)
  const currentUser = "john_doe"; // Example username

  // Fetch reviews + countries
  const fetchData = async () => {
    try {
      const reviewsRes = await axios.get(`${API_URL}/reviews`);
      setReviews(reviewsRes.data);
      const countriesRes = await axios.get(`${API_URL}/destinations/countries`);
      setCountries(countriesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.country || !newReview.text) return;

    try {
      const res = await axios.post(`${API_URL}/reviews`, {
        ...newReview,
        user: currentUser,
      });
      setMessage("Review created successfully!");
      setReviews([res.data, ...reviews]);
      setNewReview({ country: "", text: "" });
      fetchData();
    } catch (err) {
      console.error("Error creating review:", err);
    }
  };

  const handleDelete = async (id, user) => {
    if (user !== currentUser) {
      alert("You can only delete your own reviews.");
      return;
    }
    try {
      await axios.delete(`${API_URL}/reviews/${id}`);
      setMessage("Review deleted successfully!");
      fetchData();
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const handleEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleSave = async (id, user) => {
    if (user !== currentUser) {
      alert("You can only edit your own reviews.");
      return;
    }
    try {
      await axios.put(`${API_URL}/reviews/${id}`, { text: editingText });
      setMessage("Review updated successfully!");
      setEditingId(null);
      setEditingText("");
      fetchData();
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reviews</h1>

      {/* Confirmation message */}
      {message && <p style={{ color: "green" }}>{message}</p>}

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
          {reviews.map((rev) => (
            <li key={rev._id}>
              <strong>{rev.country}:</strong>{" "}
              {editingId === rev._id ? (
                <>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button onClick={() => handleSave(rev._id, rev.user)}>
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {rev.text}{" "}
                  <em style={{ color: "gray", fontSize: "12px" }}>
                    ({new Date(rev.createdAt).toLocaleDateString()})
                  </em>
                  {rev.user === currentUser && (
                    <>
                      <button onClick={() => handleEdit(rev._id, rev.text)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(rev._id, rev.user)}>
                        Delete
                      </button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}