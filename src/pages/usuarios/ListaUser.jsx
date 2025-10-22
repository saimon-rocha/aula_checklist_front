import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ListaUser() {
  const [usuarios, setUsuarios] = useState([]);
  const [filiais, setFiliais] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/usuarios`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setUsuarios(data);

      // Busca as filiais
      const filial = await fetch(`${process.env.REACT_APP_API_URL}/filiais`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const filialBusca = await filial.json();
      setFiliais(filialBusca);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar usuários");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteClick = (usuario) => {
    setUsuarioToDelete(usuario);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!usuarioToDelete) return;

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/usuarios/${usuarioToDelete.id}/ativo`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ ativo: false }),
        }
      );

      if (!response.ok) throw new Error("Erro ao desativar usuário");

      setUsuarios(
        usuarios.map((u) =>
          u.id === usuarioToDelete.id ? { ...u, id_ativo: 0 } : u
        )
      );
      toast.success("Usuário desativado com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao desativar usuário");
    } finally {
      setShowConfirm(false);
      setUsuarioToDelete(null);
    }
  };

  const handleCadastrar = () => navigate("/caduser");
  
  return (
    <div className="container-arquivos safeArea">
      <h2 style={{ textAlign: "center" }}>Usuários</h2>
      {usuarios.length === 0 ? (
        <p>Nenhum usuário cadastrado</p>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Filial</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.username}</td>
                <td>{u.Filiais?.nome || "-"}</td>
                <td>
                  {u.id_ativo ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteClick(u)}
                    >
                      Excluir
                    </Button>
                  ) : (
                    <span>Desativado</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Button className="btn btn-primary" onClick={handleCadastrar}>
        Cadastrar
      </Button>

      <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmação</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Deseja realmente desativar o usuário "{usuarioToDelete?.username}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Não
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Sim
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ListaUser;
