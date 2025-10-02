// src/pages/ReviewsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [newReview, setNewReview] = useState({
    destinationCode: "",
    city: "",
    text: "",
    image: null,
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
  const [editingId, setEditingId] = useState(null);

  // 👉 estado para novos comentários
  const [newComment, setNewComment] = useState({});

  // ================= FETCH DATA =================
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
      const formData = new FormData();
      formData.append("text", newReview.text);
      formData.append("city", newReview.city);
      formData.append("ratings", JSON.stringify(newReview.ratings));
      if (newReview.image) {
        formData.append("image", newReview.image);
      }

      const token = localStorage.getItem("authToken"); // 👈 pega token

      let res;
      if (editingId) {
        res = await axios.put(`${API_URL}/reviews/${editingId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`, // 👈 manda token
          },
        });
        setReviews(reviews.map((r) => (r._id === editingId ? res.data : r)));
        setEditingId(null);
      } else {
        res = await axios.post(
          `${API_URL}/reviews/${newReview.destinationCode}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`, // 👈 manda token
            },
          }
        );
        setReviews([...reviews, res.data]);
      }

      setNewReview({
        destinationCode: "",
        city: "",
        text: "",
        image: null,
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
      setSelectedCountry("");
      setCities([]);
    } catch (err) {
      console.error("Error saving review:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.delete(`${API_URL}/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  const handleEdit = (review) => {
    setEditingId(review._id);
    setSelectedCountry(review.destinationCode);
    setNewReview({
      destinationCode: review.destinationCode,
      city: review.city || "",
      text: review.text,
      image: null,
      ratings: review.ratings || {
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
  };

  // ================= COMMENTS CRUD =================
  const handleAddComment = async (reviewId) => {
    if (!newComment[reviewId]) return;
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        `${API_URL}/reviews/${reviewId}/comments`,
        { text: newComment[reviewId] },
        {
          headers: { Authorization: `Bearer ${token}` }, // 👈 manda token
        }
      );
      setReviews(reviews.map((r) => (r._id === reviewId ? res.data : r)));
      setNewComment({ ...newComment, [reviewId]: "" });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (reviewId, commentId) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.delete(
        `${API_URL}/reviews/${reviewId}/comments/${commentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setReviews(reviews.map((r) => (r._id === reviewId ? res.data : r)));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  // ================= RENDER =================
  return (
    <div style={{ padding: "20px" }}>
      <h1>Reviews</h1>

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
          {reviews.map((rev) => {
            const country = countries.find(
              (c) => c.iso2 === rev.destinationCode
            );
            return (
              <li key={rev._id} style={{ marginBottom: "20px" }}>
                <strong>
                  {rev.user?.name || "Anônimo"} escreveu em{" "}
                  {country ? country.name : rev.destinationCode},{" "}
                  {rev.city || "Unknown city"}:
                </strong>{" "}
                {rev.text}
                {/* Data de publicação */}
                <div
                  style={{ fontSize: "12px", color: "gray", marginTop: "4px" }}
                >
                  📅 Publicado em:{" "}
                  {new Date(rev.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
                {rev.imageUrl && (
                  <div>
                    <img
                      src={rev.imageUrl}
                      alt="Review"
                      style={{ width: "150px", marginTop: "5px" }}
                    />
                  </div>
                )}
                {/* Ratings */}
                <div>
                  {rev.ratings && (
                    <div style={{ marginTop: "10px" }}>
                      {Object.entries(rev.ratings)
                        .filter(([, value]) => Number(value) > 0)
                        .map(([key, value]) => (
                          <div key={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                            {Array.from({ length: 5 }, (_, i) =>
                              i < Number(value) ? "⭐" : "☆"
                            ).join("")}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
                {/* Comentários */}
                <div style={{ marginTop: "15px", paddingLeft: "10px" }}>
                  <h4>Comentários:</h4>
                  {rev.comments?.length === 0 && <p>Sem comentários ainda.</p>}
                  <ul>
                    {rev.comments?.map((c) => (
                      <li key={c._id}>
                        <strong>{c.user?.name || "Anônimo"}:</strong> {c.text}{" "}
                        <span style={{ fontSize: "12px", color: "gray" }}>
                          ({new Date(c.createdAt).toLocaleDateString("pt-BR")})
                        </span>
                        <button
                          style={{
                            marginLeft: "10px",
                            color: "red",
                            border: "none",
                            background: "transparent",
                            cursor: "pointer",
                          }}
                          onClick={() => handleDeleteComment(rev._id, c._id)}
                        >
                          🗑️
                        </button>
                      </li>
                    ))}
                  </ul>

                  {/* Novo comentário */}
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="text"
                      placeholder="Escreva um comentário..."
                      value={newComment[rev._id] || ""}
                      onChange={(e) =>
                        setNewComment({
                          ...newComment,
                          [rev._id]: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() => handleAddComment(rev._id)}
                      style={{ marginLeft: "5px" }}
                    >
                      Comentar
                    </button>
                  </div>
                </div>
                <button onClick={() => handleEdit(rev)}>Edit</button>
                <button
                  onClick={() => handleDelete(rev._id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
