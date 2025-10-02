import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// função helper para headers de auth
function authHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);

  const [newReview, setNewReview] = useState({
    country: "",
    city: "",
    text: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [message, setMessage] = useState("");

  // Fetch reviews + countries
  const fetchData = async () => {
    try {
      const reviewsRes = await axios.get(`${API_URL}/reviews`, {
        headers: authHeaders(),
      });
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

  // Fetch cities when country changes
  useEffect(() => {
    if (!newReview.country) {
      setCities([]);
      return;
    }

    setLoadingCities(true);
    axios
      .get(`${API_URL}/destinations/countries/${newReview.country}/cities`)
      .then((res) => setCities(res.data))
      .catch((err) => console.error("Error fetching cities:", err))
      .finally(() => setLoadingCities(false));
  }, [newReview.country]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.country || !newReview.city || !newReview.text) return;

    try {
      const res = await axios.post(`${API_URL}/reviews`, newReview, {
        headers: authHeaders(),
      });
      setMessage("Review created successfully!");
      setReviews([res.data, ...reviews]);
      setNewReview({ country: "", city: "", text: "" });
      fetchData();
    } catch (err) {
      console.error("Error creating review:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/reviews/${id}`, {
        headers: authHeaders(),
      });
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

  const handleSave = async (id) => {
    try {
      await axios.put(
        `${API_URL}/reviews/${id}`,
        { text: editingText },
        { headers: authHeaders() }
      );
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

      {message && <p style={{ color: "green" }}>{message}</p>}

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        {/* Select Country */}
        <select
          value={newReview.country}
          onChange={(e) =>
            setNewReview({ ...newReview, country: e.target.value, city: "" })
          }
        >
          <option value="">Select a country</option>
          {countries.map((c) => (
            <option key={c.iso2} value={c.iso2}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Select City */}
        {loadingCities ? (
          <span style={{ marginLeft: "10px" }}>Loading cities...</span>
        ) : (
          <select
            value={newReview.city}
            onChange={(e) =>
              setNewReview({ ...newReview, city: e.target.value })
            }
            disabled={!cities.length}
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

        {/* Review Text */}
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
              <strong>
                {rev.country} - {rev.city}:
              </strong>{" "}
              {editingId === rev._id ? (
                <>
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                  />
                  <button onClick={() => handleSave(rev._id)}>Save</button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {rev.text}{" "}
                  <em style={{ color: "gray", fontSize: "12px" }}>
                    ({new Date(rev.createdAt).toLocaleDateString()})
                  </em>
                  {/* botões só aparecem se backend retornar userId = dono */}
                  {rev.isOwner && (
                    <>
                      <button onClick={() => handleEdit(rev._id, rev.text)}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(rev._id)}>
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
