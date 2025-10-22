import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/CustomButton";
import "../styles/Login.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

export default function LoginScreen() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setMsg("");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.token; // pegar token real do backend
        localStorage.setItem("token", token); // salvar para rotas protegidas
        setMsg("Login efetuado!");
        navigate("/checklist"); // vai funcionar
      } else {
        setMsg(data.message || "Erro no login");
      }
    } catch (err) {
      console.error(err);
      setMsg("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="root">
      <div className="loginCard">
        <Form>
          <h1 className="title">Login</h1>

          <FloatingLabel
            controlId="floatingUsername"
            label="Usuário"
            className="mb-3"
          >
            <Form.Control
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />
          </FloatingLabel>

          <FloatingLabel
            controlId="floatingPassword"
            label="Senha"
            className="mb-3"
          >
            <Form.Control
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </FloatingLabel>

          <CustomButton
            text={loading ? "Carregando..." : "Entrar"}
            onClick={handleLogin}
            className="loginButton"
            disabled={loading}
          />

          {msg && <p className="msg">{msg}</p>}
        </Form>
      </div>
    </div>
  );
}
