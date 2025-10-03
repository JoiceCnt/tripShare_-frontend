import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUpPage.css"; // 👈 importa o css

const API_URL = import.meta.env.VITE_API_URL;

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, form);
      setMessage("✅ Usuário criado com sucesso!");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setMessage("❌ Erro no signup: " + err.response?.data?.error);
    }
  };

  return (
    <div className="signup-container">
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          name="name"
          placeholder="Nome"
          onChange={handleChange}
          className="signup-input"
        />
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="signup-input"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          onChange={handleChange}
          className="signup-input"
        />
        <button type="submit" className="signup-btn">
          Criar conta
        </button>
      </form>
      {message && <p className="signup-message">{message}</p>}
    </div>
  );
}
