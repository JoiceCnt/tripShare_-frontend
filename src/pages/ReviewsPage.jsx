// src/pages/ReviewsPage.jsx
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

  useEffect(() => {
    if (!selectedCountry) return;
    axios
      .get(`${API_URL}/destinations/countries/${selectedCountry}/cities`)
      .then((res) => setCities(res.data))
      .catch((err) => console.error("Error fetching cities:", err));
  }, [selectedCountry]);

  // ================= REVIEWS CRUD =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.destinationCode || !newReview.text) return;

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
      console.error("Error saving review:", err);
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
        {/* Country */}
        <select
          value={newReview.destinationCode}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setNewReview({ ...newReview, destinationCode: e.target.value });
          }}
        >
          <option value="">Select a country</option>
          {countries.map((c) => (
            <option key={c.iso2} value={c.iso2}>
              {c.name}
            </option>
          ))}
        </select>

        {/* City */}
        {cities.length > 0 && (
          <select
            value={newReview.city}
            onChange={(e) =>
              setNewReview({ ...newReview, city: e.target.value })
            }
            style={{ marginLeft: "10px" }}
          >
            <option value="">Select a city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        )}

        <textarea
          placeholder="Write your review"
          value={newReview.text}
          onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
          style={{ marginLeft: "10px" }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setNewReview({ ...newReview, image: e.target.files[0] })
          }
          style={{ marginLeft: "10px" }}
        />

        {/* Ratings */}
        <div style={{ marginTop: "15px" }}>
          {Object.keys(newReview.ratings).map((cat) => (
            <div key={cat} style={{ marginBottom: "5px" }}>
              <label style={{ marginRight: "10px" }}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}:
              </label>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{
                    cursor: "pointer",
                    color:
                      newReview.ratings[cat] >= star ? "gold" : "lightgray",
                  }}
                  onClick={() =>
                    setNewReview({
                      ...newReview,
                      ratings: { ...newReview.ratings, [cat]: star },
                    })
                  }
                >
                  ★
                </span>
              ))}
            </div>
          ))}
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          {editingId ? "Update Review" : "Submit Review"}
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
