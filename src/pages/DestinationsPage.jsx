// src/pages/DestinationsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // http://localhost:5005/api

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
    <div style={{ padding: "20px" }}>
      <h1>Destinations</h1>

      {/* Select country */}
      <select
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
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
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

      {/* Filters */}
      {selectedCity && (
        <div style={{ marginTop: "20px" }}>
          <h3>Filter by category</h3>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  padding: "5px 10px",
                  border: selectedCategories.includes(cat)
                    ? "2px solid #1C3739"
                    : "1px solid #ccc",
                  background: selectedCategories.includes(cat)
                    ? "#BFCC94"
                    : "white",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Average Ratings */}
      {reviews.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Average Ratings in {selectedCity}</h3>
          <ul>
            {categories.map((cat) => (
              <li key={cat}>
                {cat}: {getAverageRating(cat)} ⭐
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Reviews */}
      {filteredReviews.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h3>Reviews</h3>
          <ul>
            {filteredReviews.map((rev) => (
              <li key={rev._id} style={{ marginBottom: "15px" }}>
                <p>{rev.text}</p>
                {rev.imageUrl && (
                  <img
                    src={rev.imageUrl}
                    alt="Review"
                    style={{ width: "150px", borderRadius: "8px" }}
                  />
                )}
                <div>
                  {Object.entries(rev.ratings || {})
                    .filter(([, v]) => Number(v) > 0)
                    .map(([k, v]) => (
                      <span key={k} style={{ marginRight: "10px" }}>
                        {k}: {v}⭐
                      </span>
                    ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
