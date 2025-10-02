// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 importar
import axios from "axios";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // 👈 hook para navegar

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL; // pega a URL do .env
      const res = await axios.post(`${API_URL}/auth/login`, form);

      // se precisar salvar o token, por exemplo:
      localStorage.setItem("authToken", res.data.token);

      setMessage("✅ Login realizado!");

      // redireciona para HomePage
      navigate("/");
    } catch (err) {
      setMessage("❌ Erro no login: " + (err.response?.data?.error || "Erro"));
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">Entrar</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}