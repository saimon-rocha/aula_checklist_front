import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import '../../styles/Filial.css';
import { toast } from "react-toastify";
import { buscaCEP } from "../../utils/buscaCep";

function Filial() {
  const [nomeFilial, setNomeFilial] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState({
    rua: "",
    bairro: "",
    ruaReadOnly: true,
    bairroReadOnly: true,
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Checagem de admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (!payload.id_admin) { // se não for admin
          toast.error("Acesso negado: apenas administradores.");
          navigate("/checklist");
        }
      } catch (err) {
        console.error("Erro ao ler token:", err);
        navigate("/checklist");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleCepChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setCep(value);

    if (value.length === 8) {
      const data = await buscaCEP(value);

      const ruaFaltando = !data.rua;
      const bairroFaltando = !data.bairro;

      setEndereco({
        rua: data.rua,
        bairro: data.bairro,
        ruaReadOnly: !ruaFaltando,
        bairroReadOnly: !bairroFaltando,
      });

      if (ruaFaltando && bairroFaltando) {
        toast.info("CEP geral: preencha manualmente Rua e Bairro.");
      } else if (ruaFaltando) {
        toast.info("CEP não informa Rua. Preencha manualmente.");
      } else if (bairroFaltando) {
        toast.info("CEP não informa Bairro. Preencha manualmente.");
      }
    } else {
      setEndereco({ rua: "", bairro: "", ruaReadOnly: true, bairroReadOnly: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {

      const dadosCompletos = {
        nomeFilial: nomeFilial,
        rua: endereco.rua,
        bairro: endereco.bairro,
        cep: cep,
        id_ativo: true
      };
      
      // Enviar para o backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/filiais`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dadosCompletos)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Filial cadastrada com sucesso!");
        navigate("/checklist");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Ocorreu um erro ao salvar: ", error);
      toast.error("Erro ao salvar filial.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white form-container">
            <h2 className="text-center mb-4">Cadastro de Filial</h2>

            <Form.Group className="mb-3" controlId="formNomeFilial">
              <Form.Label>Nome da Filial</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome da filial"
                value={nomeFilial}
                onChange={(e) => setNomeFilial(e.target.value)}
                required
              />
            </Form.Group>

            <Row className="mb-3">
              <Col xs={12} md={6}>
                <Form.Group controlId="formCep">
                  <Form.Label>CEP</Form.Label>
                  <Form.Control
                    type="text"
                    value={cep}
                    onChange={handleCepChange}
                    maxLength={8}
                    placeholder="Digite o CEP"
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group controlId="formRua">
                  <Form.Label>Rua</Form.Label>
                  <Form.Control
                    value={endereco.rua}
                    onChange={(e) => setEndereco({ ...endereco, rua: e.target.value })}
                    readOnly={endereco.ruaReadOnly}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="formBairro">
              <Form.Label>Bairro</Form.Label>
              <Form.Control
                value={endereco.bairro}
                onChange={(e) => setEndereco({ ...endereco, bairro: e.target.value })}
                readOnly={endereco.bairroReadOnly}
                required
              />
            </Form.Group>

            <Button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Salvando..." : "Cadastrar"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Filial;
