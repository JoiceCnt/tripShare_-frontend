// src/pages/SignUpPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 importa o hook
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // 👈 inicializa

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/auth/register`, form);
      setMessage("✅ Usuário criado com sucesso!");

      // 👇 redireciona para login após criar usuário
      setTimeout(() => {
        navigate("/login");
      }, 1000); // espera 1 segundo para mostrar a mensagem
    } catch (err) {
      setMessage("❌ Erro no signup: " + err.response?.data?.error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Nome" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          onChange={handleChange}
        />
        <button type="submit">Criar conta</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
