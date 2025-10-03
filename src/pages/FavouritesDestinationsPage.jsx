// src/pages/FavouritesDestinationsPage.jsx
import { useEffect, useState } from "react";

export default function FavouritesDestinationsPage() {
  const [favourites, setFavourites] = useState([]);
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem("favourites") || "[]");
    setFavourites(favs);
  }, []);

  const filtered = cityFilter
    ? favourites.filter((d) => d.city === cityFilter)
    : favourites;

  // Para opciones de ciudad (para filtrar)
  const cities = [...new Set(favourites.map((d) => d.city))];

  return (
    <div style={{ padding: "20px" }}>
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
        <ul>
          {filtered.map((d) => (
            <li key={d._id} style={{ marginBottom: "20px" }}>
              <h3>
                {d.name} - {d.city}, {d.country}
              </h3>
              <p>{d.description}</p>
              {d.imageUrl && (
                <img
                  src={d.imageUrl}
                  alt={d.name}
                  style={{ width: "200px", borderRadius: "8px" }}
                />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
