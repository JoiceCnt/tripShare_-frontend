// src/pages/DestinationsPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL; // deve ser http://localhost:5005/api

export default function DestinationsPage() {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");

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

  return (
    <div>
      <h1>Destinations</h1>

      {/* Select country */}
      <select
        value={selectedCountry}
        onChange={(e) => {
          setSelectedCountry(e.target.value);
          setCities([]); // limpa as cidades ao mudar o país
        }}
      >
        <option value="">Select a country</option>
        {countries.map((c) => (
          <option key={c.iso2} value={c.iso2}>
            {c.name}
          </option>
        ))}
      </select>

      {/* List of cities */}
      {selectedCountry && (
        <div>
          <h2>Cities in {selectedCountry}</h2>
          {cities.length === 0 ? (
            <p>Loading cities...</p>
          ) : (
            <ul>
              {cities.map((city) => (
                <li key={city.id}>{city.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
