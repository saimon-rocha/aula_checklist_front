import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import sha256 from "crypto-js/sha256";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import validarCPF from '../../utils/validarCPF';
import { toast } from "react-toastify";

function CadastroUsuarioOffline() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cpf, setCpf] = useState("");
  const [filialSelecionada, setFilialSelecionada] = useState("");
  const [filiais, setFiliais] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Agora busca as filiais da API
  useEffect(() => {
    const fetchFiliais = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/filiais`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Erro ao buscar filiais");

        const data = await response.json();
        setFiliais(data);
      } catch (error) {
        console.error(error);
        toast.error("Erro ao carregar filiais.");
      }
    };

    fetchFiliais();
  }, []);

  const handleCpfChange = (e) => {
    setCpf(e.target.value.replace(/\D/g, ""));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (filiais.length === 0) {
      toast.warning("Cadastre uma filial antes de criar usuários.");
      return;
    }

    if (!email || !senha || !cpf || !filialSelecionada) {
      toast.warning("Preencha todos os campos!");
      return;
    }

    if (!validarCPF(cpf)) {
      toast.warning("CPF inválido!");
      return;
    }

    setLoading(true);

    try {
      const senhaHash = sha256(senha.trim()).toString();

      const novoUsuario = {
        username: email.trim(),
        password: senhaHash,
        cpf: cpf.trim(),
        filial: filialSelecionada,
        ativo: true,
      };

      // 🔹 Envia para a API
      const token = localStorage.getItem("token"); // se precisar de autenticação
      const response = await fetch(`${process.env.REACT_APP_API_URL}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(novoUsuario),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Erro ao salvar usuário.");
        return;
      }

      toast.success("Usuário cadastrado com sucesso!");

      // limpa campos
      setEmail("");
      setSenha("");
      setCpf("");
      setFilialSelecionada("");

      setTimeout(() => {
        navigate("/checklist");
      }, 1500);

    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white form-container">
        <h2 className="text-center mb-4">Cadastro de Usuário</h2>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        <Row className="mb-3">
          <Form.Group as={Col} md={6} controlId="formSenha">
            <Form.Label>Senha</Form.Label>
            <Form.Control
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group as={Col} md={6} controlId="formCpf">
            <Form.Label>CPF</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite seu CPF"
              value={cpf}
              onChange={handleCpfChange}
              maxLength={11}
              required
            />
          </Form.Group>
        </Row>

        <Form.Group className="mb-4" controlId="formFilial">
          <Form.Label>Filial</Form.Label>
          <Form.Select
            value={filialSelecionada}
            onChange={(e) => setFilialSelecionada(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {filiais.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Cadastrar"}
        </Button>
      </Form>
    </Container>
  );
}

export default CadastroUsuarioOffline;
