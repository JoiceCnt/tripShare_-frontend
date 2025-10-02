import { useEffect, useState } from "react";
import axios from "axios";
import "./ReviewsPage.css";

const API_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [newReview, setNewReview] = useState({
    country: "",
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

  const loggedUser = localStorage.getItem("username"); // assume que salvou username no login

  // Fetch reviews + countries
  useEffect(() => {
    axios
      .get(`${API_URL}/reviews`, { headers: authHeaders() })
      .then((res) => setReviews(res.data))
      .catch((err) => console.error("Error fetching reviews:", err));

    axios
      .get(`${API_URL}/destinations/countries`)
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Error fetching countries:", err));
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRating = (category, value) => {
    setNewReview((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [category]: value },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.country || !newReview.city || !newReview.text) return;

    try {
      let imageUrl = "";
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        formData.append("upload_preset", "your_upload_preset"); // configure no Cloudinary
        const uploadRes = await axios.post(
          `https://api.cloudinary.com/v1_1/your_cloud_name/image/upload`,
          formData
        );
        imageUrl = uploadRes.data.secure_url;
      }

      const reviewData = { ...newReview, image: imageUrl, user: loggedUser };

      const res = await axios.post(`${API_URL}/reviews`, reviewData, {
        headers: authHeaders(),
      });
      setReviews([res.data, ...reviews]);
      setNewReview({
        country: "",
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
      setImageFile(null);
      setPreview("");
    } catch (err) {
      console.error("Error creating review:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/reviews/${id}`, {
        headers: authHeaders(),
      });
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <div className="reviews-container">
      <h1 className="title">Reviews</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="review-form">
        <div className="upload-box">
          <input type="file" onChange={handleImageChange} />
          {preview && (
            <img src={preview} alt="preview" className="preview-img" />
          )}
        </div>

        <select
          value={newReview.country}
          onChange={(e) =>
            setNewReview({ ...newReview, country: e.target.value, city: "" })
          }
        >
          <option value="">Country</option>
          {countries.map((c) => (
            <option key={c.iso2} value={c.iso2}>
              {c.name}
            </option>
          ))}
        </select>

        {/* Select City com loading */}
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
            <option value="">City</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        )}

        <textarea
          placeholder="Write about your experience"
          value={newReview.text}
          onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
        />

        {/* Ratings */}
        <div className="ratings-box">
          {Object.keys(newReview.ratings).map((cat) => (
            <div key={cat} className="rating-row">
              <span>{cat}</span>
              {[1, 2, 3, 4, 5].map((n) => (
                <span
                  key={n}
                  className={
                    newReview.ratings[cat] >= n ? "star filled" : "star"
                  }
                  onClick={() => handleRating(cat, n)}
                >
                  ★
                </span>
              ))}
            </div>
          ))}
        </div>

        <button type="submit" className="share-btn">
          Share
        </button>
      </form>

      {/* Reviews list */}
      <ul className="reviews-list">
        {reviews.map((rev) => (
          <li key={rev._id} className="review-card">
            {rev.image && (
              <img src={rev.image} alt="review" className="review-img" />
            )}
            <div>
              <strong>
                {rev.country} - {rev.city}
              </strong>
              <p>{rev.text}</p>
              <div className="ratings-inline">
                {Object.entries(rev.ratings).map(([cat, val]) => (
                  <span key={cat}>
                    {cat}: {"★".repeat(val)}
                  </span>
                ))}
              </div>
              {rev.user === loggedUser && (
                <div className="actions">
                  <button onClick={() => alert("Edit here")}>Edit</button>
                  <button onClick={() => handleDelete(rev._id)}>Delete</button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
