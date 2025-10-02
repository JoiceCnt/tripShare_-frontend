// src/pages/ReviewsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [newReview, setNewReview] = useState({ destinationCode: "", text: "" });
  const [editingReview, setEditingReview] = useState(null); // holds the review being edited
  const [editText, setEditText] = useState("");

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

  // Create a new review
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.destinationCode || !newReview.text) return;

    try {
      const res = await axios.post(
        `${API_URL}/reviews/${newReview.destinationCode}`,
        { text: newReview.text }
      );
      setReviews([...reviews, res.data]);
      setNewReview({ destinationCode: "", text: "" });
    } catch (err) {
      console.error("Error creating review:", err);
    }
  };

  // Start editing a review
  const handleEdit = (review) => {
    setEditingReview(review._id);
    setEditText(review.text);
  };

  // Save the updated review
  const handleSaveEdit = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/reviews/${id}`, {
        text: editText,
      });
      setReviews(reviews.map((rev) => (rev._id === id ? res.data : rev)));
      setEditingReview(null);
      setEditText("");
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditText("");
  };

  // Delete a review
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/reviews/${id}`);
      setReviews(reviews.filter((rev) => rev._id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Reviews</h1>

      {/* Form to add a new review */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <select
          value={newReview.destinationCode}
          onChange={(e) =>
            setNewReview({ ...newReview, destinationCode: e.target.value })
          }
        >
          <option value="">Select a country</option>
          {countries.map((c) => (
            <option key={c.iso2} value={c.iso2}>
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
          {reviews.map((rev) => {
            const country = countries.find(
              (c) => c.iso2 === rev.destinationCode
            );

            return (
              <li key={rev._id} style={{ marginBottom: "10px" }}>
                <strong>{country ? country.name : rev.destinationCode}:</strong>{" "}
                {editingReview === rev._id ? (
                  <>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button onClick={() => handleSaveEdit(rev._id)}>
                      Save
                    </button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  <>
                    {rev.text}
                    <button
                      onClick={() => handleEdit(rev)}
                      style={{ marginLeft: "10px" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(rev._id)}
                      style={{ marginLeft: "5px", color: "red" }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
