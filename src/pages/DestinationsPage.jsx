// src/pages/DestinationsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "./DestinationsPage.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function DestinationsPage() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Fetch all countries
  useEffect(() => {
    axios
      .get(`${API_URL}/destinations/countries`)
      .then((res) => setCountries(res.data))
      .catch((err) => console.error("Error fetching countries:", err));
  }, []);

  // Fetch cities when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    axios
      .get(`${API_URL}/destinations/countries/${selectedCountry}/cities`)
      .then((res) => setCities(res.data))
      .catch((err) => console.error("Error fetching cities:", err));
  }, [selectedCountry]);

  // Fetch reviews when city changes
  useEffect(() => {
    if (!selectedCountry || !selectedCity) return;
    axios
      .get(
        `${API_URL}/reviews?country=${selectedCountry}&city=${encodeURIComponent(
          selectedCity
        )}`
      )
      .then((res) => {
        setReviews(res.data);
        setFilteredReviews(res.data); // inicial sem filtro
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  }, [selectedCountry, selectedCity]);

  // Handle filter selection
  const toggleCategory = (cat) => {
    let updated;
    if (selectedCategories.includes(cat)) {
      updated = selectedCategories.filter((c) => c !== cat);
    } else {
      updated = [...selectedCategories, cat];
    }
    setSelectedCategories(updated);

    // filtra reviews com base nas categorias selecionadas
    if (updated.length === 0) {
      setFilteredReviews(reviews);
    } else {
      const filtered = reviews.filter((r) =>
        updated.some((cat) => Number(r.ratings?.[cat]) > 0)
      );
      setFilteredReviews(filtered);
    }
  };

  // Função para calcular média de rating por categoria
  const getAverageRating = (category) => {
    const valid = reviews
      .map((r) => Number(r.ratings?.[category]) || 0)
      .filter((v) => v > 0);
    if (valid.length === 0) return 0;
    return (valid.reduce((sum, v) => sum + v, 0) / valid.length).toFixed(1);
  };

  // Função para pegar a review com mais likes
  const getTopReview = () => {
    if (reviews.length === 0) return null;
    return reviews.reduce((max, r) =>
      (r.likes?.length || 0) > (max.likes?.length || 0) ? r : max
    );
  };

  // Função para formatar os nomes das categorias
  const formatCategoryName = (cat) => {
    return cat
      .replace(/([A-Z])/g, " $1") // separa camelCase
      .replace(/^./, (str) => str.toUpperCase()); // primeira letra maiúscula
  };

  const categories = [
    "gastronomy",
    "events",
    "petFriendly",
    "kidsFriendly",
    "culture",
    "nature",
    "shopping",
    "safety",
  ];

  return (
    <div className="destinations-page">
      <h1 className="page-title">Destinations</h1>

      {/* Select country */}
      <select
        className="select-input"
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setCities([]);
          setSelectedCity("");
          setReviews([]);
          setFilteredReviews([]);
        }}
      >
        <option value="">Select a country</option>
        {countries.map((c) => (
          <option key={c.iso2} value={c.iso2}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Select city */}
      {cities.length > 0 && (
        <select
          className="select-input"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      )}

      {/* Filters */}
      {selectedCity && (
        <div className="filters">
          <h3>Filter by category</h3>
          <div className="filter-buttons">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`filter-btn ${
                  selectedCategories.includes(cat) ? "active" : ""
                }`}
              >
                {formatCategoryName(cat)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Average Ratings */}
      {reviews.length > 0 && (
        <div className="average-section">
          <h3>Average Ratings in {selectedCity}</h3>
          <ul className="average-list">
            {categories.map((cat) => (
              <li key={cat}>
                {formatCategoryName(cat)}: {getAverageRating(cat)} ⭐
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Most Liked Review */}
      {reviews.length > 0 && (
        <div className="top-review">
          <h3>⭐ Most Liked Review in {selectedCity}</h3>
          {(() => {
            const top = getTopReview();
            if (!top) return <p>No reviews yet.</p>;
            return (
              <div className="review-card top horizontal">
                <p className="review-text">
                  <strong>{top.text}</strong>
                </p>
                {top.imageUrl && (
                  <img
                    src={top.imageUrl}
                    alt="Top review"
                    className="review-img right"
                  />
                )}
                <p>👍 {top.likes?.length || 0} likes</p>
              </div>
            );
          })()}
        </div>
      )}

      {/* Reviews */}
      {filteredReviews.length > 0 && (
        <div className="reviews-list">
          <h3>All Reviews</h3>
          <ul>
            {[...filteredReviews]
              .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
              .map((rev) => (
                <li key={rev._id} className="review-card horizontal">
                  <p className="review-text">{rev.text}</p>
                  {rev.imageUrl && (
                    <img
                      src={rev.imageUrl}
                      alt="Review"
                      className="review-img right"
                    />
                  )}
                  <p>👍 {rev.likes?.length || 0} likes</p>
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
