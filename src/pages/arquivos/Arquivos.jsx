import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import gerarPDF from "../../utils/gerarPDF.js";
import { toast } from "react-toastify";
import '../../styles/Arquivos.css';

function ArquivosOffline() {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formularioToDelete, setFormularioToDelete] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem("token");

  const fetchFormularios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/formularios`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Erro na API");
      }

      const data = await response.json();
      setFormularios(data);
    } catch (err) {
      console.error("Erro ao buscar formulários:", err);
      toast.error("Erro ao carregar formulários");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormularios();
  }, []);

  const handleDeleteClick = (formulario) => {
    setFormularioToDelete(formulario);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!formularioToDelete) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/formularios/${formularioToDelete.id}/ativo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_ativo: false }),
      });

      if (!response.ok) throw new Error("Erro ao excluir formulário");

      setFormularios((prev) =>
        prev.filter((f) => f.id !== formularioToDelete.id)
      );
      toast.success("Formulário excluido com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao excluir formulário");
    } finally {
      setShowConfirm(false);
      setFormularioToDelete(null);
    }
  };

  const handleDownloadPDF = (formulario) => {
    try {
      // normaliza usuário
      const usuario = formulario.usuario || formulario.username || "—";

      // normaliza filial
      const filialNome = formulario.filial_nome || formulario.Filial?.nome || "—";

      // normaliza data
      const data = formulario.data || formulario.createdAt || new Date();

      // normaliza checklist
      const checklist = Array.isArray(formulario.checklist)
        ? formulario.checklist.map(item => ({
          id: item.id || "",
          label: item.label || item.id || "",
          resposta: String(item.resposta || "").toUpperCase()
        }))
        : [];

      // normaliza ensaio
      const ensaio = Array.isArray(formulario.ensaio)
        ? formulario.ensaio.map(item => ({
          id: item.id || "",
          label: item.label || item.id || "",
          resposta: String(item.resposta || "").toUpperCase()
        }))
        : [];

      const dadosParaPDF = {
        titulo: formulario.titulo || "Sem título",
        usuario,
        filial_nome: filialNome,
        data,
        checklist,
        ensaio,
      };

      gerarPDF(dadosParaPDF);

    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      toast.error("Erro ao gerar PDF");
    }
  };




  return (
    <div className="container-arquivos safeArea">
      <h2 style={{ textAlign: "center" }}>Meus Formulários</h2>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Título</th>
              <th>Filial</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {formularios.length > 0 ? (
              formularios.map((f) => (
                <tr key={f.id}>
                  <td>{f.titulo}</td>
                  <td>{f.Filial?.nome || "—"}</td>
                  <td>
                    <div className="tableButtonGroup">
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleDownloadPDF(f)}
                      >
                        PDF
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(f)}
                      >
                        Excluir
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3}>Nenhum formulário cadastrado</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      {/* Modal de confirmação */}
      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja realmente excluir o formulário <br />
          "{formularioToDelete?.titulo}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>Não</Button>
          <Button variant="danger" onClick={handleConfirmDelete}>Sim</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ArquivosOffline;
