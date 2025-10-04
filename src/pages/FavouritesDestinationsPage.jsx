import { useEffect, useState } from "react";
import "./FavouritesDestinationsPage.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function FavouritesDestinationsPage() {
  const [favourites, setFavourites] = useState([]);
  const [cityFilter, setCityFilter] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
    setFavourites(favs);
  }, []);

  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await axios.get(`${API_URL}/favourites`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavourites(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavourites();
  }, [token]);

  const filtered = cityFilter
    ? favourites.filter((d) => d.city === cityFilter)
    : favourites;

  const cities = [...new Set(favourites.map((d) => d.city))];

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
    <div className="fDestination-page">
      <h1>My Favourites Destinations</h1>

      {cities.length > 0 && (
        <div style={{ marginBottom: "20px" }}>
          <label>City filter: </label>
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            <option value="">All Destinations</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

      {filtered.length === 0 ? (
        <p>Not yet favourite destinations..</p>
      ) : (
        <div className="fDestination-section">
          {filtered.map((d) => (
            <article key={d._id} className="fDestination-card">
              {/* Imagen normal */}
              {d.imageUrl && (
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  className="fDestination-image"
                />
              )}

              {/* Contenido */}
              <div className="fDestination-content">
                <div>
                  <h3 className="fDestination-title">{d.name}</h3>
                  <div className="fDestination-meta">
                    <span>{d.city}</span>
                    <span className="dot"></span>
                    <span>{d.country}</span>
                  </div>
                  <p className="fDestination-description">{d.description}</p>
                </div>

                {/* Ratings */}
                {d.ratings && (
                  <ul className="fDestination-ratings">
                    {categories.map((cat) =>
                      d.ratings[cat] > 0 ? (
                        <li key={cat}>
                          {cat}: {d.ratings[cat]}⭐
                        </li>
                      ) : null
                    )}
                  </ul>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
