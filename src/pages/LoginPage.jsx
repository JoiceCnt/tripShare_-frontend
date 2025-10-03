import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 importar
import axios from "axios";
import "./LoginPage.css";

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
      localStorage.setItem("userId", res.data.user._id);

      setMessage("✅ Login realizado!");

      // redireciona para HomePage
      navigate("/");
    } catch (err) {
      setMessage("❌ Erro no login: " + (err.response?.data?.error || "Erro"));
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          className="login-input"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="login-input"
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button className="login-button" type="submit">
          Entrar
        </button>
      </form>
      {message && <p className="login-message">{message}</p>}
    </div>
  );
}
