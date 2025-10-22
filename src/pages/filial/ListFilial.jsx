import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ListaFilial() {
    const [usuarios, setUsuarios] = useState([]);
    const [filiais, setFiliais] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [filialToDelete, setFilialToDelete] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL;
    const token = localStorage.getItem("token");

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const filiais = await fetch(`${process.env.REACT_APP_API_URL}/filiais`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res => res.json());
            setFiliais(filiais);
            //
            const usuarios = await fetch(`${process.env.REACT_APP_API_URL}/usuarios`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }).then(res => res.json());
            setUsuarios(usuarios);
        } catch (error) {
            toast.error("Erro ao carregar dados.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCadastrar = () => {
        navigate("/cadfilial");
    };

    // Abre o modal de confirmação
    const handleDeleteClick = (filial) => {
        // Verifica se há usuários vinculados
        const usuariosVinculados = usuarios.filter(u => u.filial === filial.id);
        if (usuariosVinculados.length > 0) {
            toast.warning("Não é possível excluir esta filial, pois há usuários vinculados a ela.");
            return;
        }

        setFilialToDelete(filial);
        setShowConfirm(true);
    };

    // Confirma exclusão
    const handleConfirmDelete = async () => {
        if (!filialToDelete) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/filiais/${filialToDelete.id}/ativo`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id_ativo: false }),
            });

            if (!response.ok) throw new Error("Erro ao excluir filial");

            setFiliais((prev) =>
                prev.filter((f) => f.id !== filialToDelete.id)
            );
            toast.success("Filial excluida com sucesso!");
        } catch (err) {
            console.error(err);
            toast.error("Erro ao excluir filial");
        } finally {
            setShowConfirm(false);
            setFilialToDelete(null);
        }
    };

    return (
        <div className="container-arquivos safeArea">
            <h2 style={{ textAlign: "center" }}>Filiais</h2>
            {filiais.length === 0 ? (
                <p>Nenhuma filial cadastrada</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nome da Filial</th>
                            <th>CEP</th>
                            <th>Rua</th>
                            <th>Bairro</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filiais.map((f) => (
                            <tr key={f.id}>
                                <td>{f.nome}</td>
                                <td>{f.cep}</td>
                                <td>{f.rua}</td>
                                <td>{f.bairro}</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDeleteClick(f)}
                                    >
                                        Excluir
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <button className="btn btn-primary" onClick={handleCadastrar}>
                Cadastrar
            </button>

            {/* Modal de confirmação */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmação</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Deseja realmente excluir a filial "{filialToDelete?.nome}"?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>Não</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Sim</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ListaFilial;
