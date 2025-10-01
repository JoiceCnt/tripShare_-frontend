// src/pages/DestinationDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function DestinationDetailPage() {
  const { id } = useParams(); // pega o destino da URL
  const [destination, setDestination] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    // busca o destino pelo id
    axios.get(`http://localhost:5005/api/destinations/${id}`).then((res) => {
      setDestination(res.data);
    });

    // busca as reviews desse destino
    axios.get(`http://localhost:5005/api/reviews/${id}`).then((res) => {
      setReviews(res.data);
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5005/api/reviews/${id}`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      // recarregar reviews
      const updated = await axios.get(
        `http://localhost:5005/api/reviews/${id}`
      );
      setReviews(updated.data);
    } catch (err) {
      console.log(err);
      alert("Erro ao enviar review");
    }
  };

  if (!destination) return <p>Carregando destino...</p>;

  return (
    <div>
      <h2>
        {destination.name} - {destination.country}
      </h2>
      <p>{destination.description}</p>

      <h3>Reviews</h3>
      <ul>
        {reviews.map((r) => (
          <li key={r._id}>{r.text}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Escreva sua review..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit">Enviar Review</button>
      </form>
    </div>
  );
}
