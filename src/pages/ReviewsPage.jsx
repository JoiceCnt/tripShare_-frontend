// src/pages/ReviewsPage.jsx
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "./ReviewsPage.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    destinationCode: "",
    city: "",
    text: "",
    ratings: {
      gastronomy: 0,
      events: 0,
      petFriendly: 0,
      kidsFriendly: 0,
      culture: 0,
      nature: 0,
      shopping: 0,
      safety: 0,
    },
  });
  const [image, setImage] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  // ==== Países e Cidades ====
  const CSC_API_URL = "https://api.countrystatecity.in/v1";
  const CSC_API_KEY = import.meta.env.VITE_CSC_API_KEY;
  const HEADERS = useMemo(
    () => ({ "X-CSCAPI-KEY": CSC_API_KEY }),
    [CSC_API_KEY]
  );

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    axios
      .get(`${CSC_API_URL}/countries`, { headers: HEADERS })
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("❌ Error fetching countries:", err));
  }, [HEADERS]);

  const handleCountryChange = async (e) => {
    const code = e.target.value;
    setNewReview({ ...newReview, destinationCode: code, city: "" });
    try {
      const res = await axios.get(`${CSC_API_URL}/countries/${code}/cities`, {
        headers: HEADERS,
      });
      setCities(res.data);
    } catch (err) {
      console.error("❌ Error fetching cities:", err);
    }
  };

  // ==== Auth ====
  const token = localStorage.getItem("authToken");
  const currentUserId = localStorage.getItem("userId") || "";

  // ==== GET Reviews ====
  useEffect(() => {
    axios
      .get(`${API_URL}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("❌ Error loading reviews:", err));
  }, [token]);

  // ==== Handle inputs ====
  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleRating = (category, value) => {
    setNewReview({
      ...newReview,
      ratings: { ...newReview.ratings, [category]: value },
    });
  };

  const handleImage = (e) => {
    setImage(e.target.files[0]);
  };

  // ==== Create & Update ====
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("text", newReview.text);
      formData.append("city", newReview.city);
      formData.append("ratings", JSON.stringify(newReview.ratings));
      if (image) formData.append("image", image);

      let res;
      if (editingReview) {
        // Update
        res = await axios.put(
          `${API_URL}/reviews/${editingReview._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setReviews(
          reviews.map((r) => (r._id === editingReview._id ? res.data : r))
        );
        setEditingReview(null);
      } else {
        // Create
        res = await axios.post(
          `${API_URL}/reviews/${newReview.destinationCode}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setReviews([res.data, ...reviews]);
      }

      // Reset form
      setNewReview({
        destinationCode: "",
        city: "",
        text: "",
        ratings: {
          gastronomy: 0,
          events: 0,
          petFriendly: 0,
          kidsFriendly: 0,
          culture: 0,
          nature: 0,
          shopping: 0,
          safety: 0,
        },
      });
      setCities([]);
      setImage(null);
    } catch (err) {
      console.error("❌ Error posting/editing review:", err);
    }
  };

  // ==== Delete ====
  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this review?"
      );
      if (!confirmDelete) return; // cancel if user clicks "Cancel"

      await axios.delete(`${API_URL}/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error("❌ Error deleting review:", err);
    }
  };

  // ==== LIKE review ====
  const handleLike = async (id) => {
    try {
      const res = await axios.post(
        `${API_URL}/reviews/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews(reviews.map((r) => (r._id === id ? res.data : r)));
    } catch (err) {
      console.error("❌ Error liking review:", err);
    }
  };

  return (
    <div className="reviews-page">
      <h2>Share your experience</h2>

      {/* === Create / Edit Form === */}
      <form onSubmit={handleSubmit} className="review-form">
        <select
          name="destinationCode"
          value={newReview.destinationCode}
          onChange={handleCountryChange}
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c.iso2} value={c.iso2}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          name="city"
          value={newReview.city}
          onChange={handleChange}
          disabled={!newReview.destinationCode}
        >
          <option value="">Select City</option>
          {cities.map((city, index) => (
            <option key={city.id || index} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>

        <textarea
          name="text"
          value={newReview.text}
          onChange={handleChange}
          placeholder="Write about your experience"
          maxLength={500}
        />

        <input type="file" onChange={handleImage} />

        <div className="ratings">
          {Object.keys(newReview.ratings).map((cat) => (
            <div key={cat}>
              <label>{cat}</label>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  style={{
                    cursor: "pointer",
                    color: newReview.ratings[cat] >= n ? "gold" : "lightgray",
                  }}
                  onClick={() => handleRating(cat, n)}
                >
                  ★
                </span>
              ))}
            </div>
          ))}
        </div>

        <button type="submit">{editingReview ? "Save Edit" : "Share"}</button>
      </form>

      {/* === List Reviews === */}
      {reviews.map((r) => (
        <div key={r._id} className="review-card">
          <p>
            <b>{r.user?.name}</b> shared about {r.city}, {r.destinationCode} on{" "}
            {new Date(r.createdAt).toLocaleDateString()}
          </p>
          <p>{r.text}</p>
          {r.imageUrl && <img src={r.imageUrl} alt="review" width="200" />}

          <div>
            {Object.entries(r.ratings).map(([cat, val]) => (
              <div key={cat}>
                {cat
                  .replace(/([A-Z])/g, " $1") // separa camelCase
                  .replace(/^./, (str) => str.toUpperCase())}
                : {"★".repeat(val)} {"☆".repeat(5 - val)}
              </div>
            ))}
          </div>
          {/* 👍 Like button for all users */}
          <button onClick={() => handleLike(r._id)}>
            👍 {r.likes?.length || 0}
          </button>

          {/* Only owner can edit/delete */}
          {String(r.user?._id) === String(currentUserId) && (
            <div>
              <button onClick={() => handleDelete(r._id)}>Delete</button>
              <button onClick={() => setEditingReview(r)}>Edit</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
