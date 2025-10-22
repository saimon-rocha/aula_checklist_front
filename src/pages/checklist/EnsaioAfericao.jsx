import { useLocation, useNavigate } from "react-router-dom";
import { ensaioAfericaoItems, checklistItems} from "../../utils/checklistStructure.js";
import { useState, useEffect } from "react";
import Card from "../../components/Card.jsx";
import PerguntaTexto from "../../components/PerguntaTexto.jsx";
import PerguntaRadio from "../../components/PerguntaRadio.jsx";
import PerguntaRadioDefeito from "../../components/PerguntaRadioDefeito.jsx";
import PerguntaCheckbox from "../../components/PerguntaCheckbox.jsx";
import "../../styles/EnsaioAfericao.css";

import { format } from "date-fns";
import { toast } from "react-toastify";

const ChecklistField = ({ item, formData, onChange }) => {
  if (item.dependsOn && formData[item.dependsOn] !== item.showIf) return null;

  return (
    <Card>
      {item.type === "radio" && !item.dangerOnSim && (
        <PerguntaRadio
          label={item.label}
          selectedValue={formData[item.id]}
          onChange={(val) => onChange(item.id, val)}
        />
      )}

      {item.type === "radio" && item.dangerOnSim && (
        <PerguntaRadioDefeito
          label={item.label}
          selectedValue={formData[item.id]}
          onChange={(val) => onChange(item.id, val)}
        />
      )}

      {item.type === "text" && (
        <PerguntaTexto
          label={item.label}
          subtitle={item.subtitle}
          placeholder={item.placeholder}
          value={formData[item.id]}
          onChange={(val) => onChange(item.id, val)}
          numeric
        />
      )}

      {item.type === "checkbox" && (
        <PerguntaCheckbox
          label={item.label}
          options={item.options}
          selectedValues={formData[item.id]}
          onChange={(vals) => onChange(item.id, vals)}
        />
      )}
    </Card>
  );
};

// Função para extrair payload do JWT
function parseJwt(token) {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

// Gera título automático
function gerarTitulo() {
  return `Checklist ${format(new Date(), "dd-MM-yyyy HH:mm", { timeZone: "America/Sao_Paulo" })}`
}

export default function EnsaioAfericao({ refreshFiles }) {
  const location = useLocation();
  const { primeiroForm } = location.state || {};
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const initialState = ensaioAfericaoItems.reduce((acc, item) => {
    if (item.type === "checkbox") acc[item.id] = [];
    else if (item.type === "radio") acc[item.id] = "nao";
    else acc[item.id] = "";
    return acc;
  }, {});

  const [form, setForm] = useState(() => {
    const saved = localStorage.getItem("ensaioForm");
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem("ensaioForm", JSON.stringify(form));
  }, [form]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleBack = () => {
    navigate("/checklist", { state: { primeiroForm } });
  };

  const handleConclude = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = token ? parseJwt(token) : null;

      // checklist (primeiroForm)
      const checklistArray = Object.keys(primeiroForm || {}).map(key => ({
        id: key,
        label: checklistItems.find(i => i.id === key)?.label || key,
        resposta: primeiroForm[key] || "—" // default caso vazio
      }));

      // ensaio (form)
      const ensaioArray = Object.keys(form).map(key => ({
        id: key,
        label: ensaioAfericaoItems.find(i => i.id === key)?.label || key,
        resposta: form[key] || "—" // default caso vazio
      }));

      const filiais = JSON.parse(localStorage.getItem("filiais")) || [];
      const filiaisMap = filiais.map((f, idx) => ({ ...f, simpleId: String(idx + 1) }));
      const filialSelecionada = filiaisMap.find(f => f.id === payload?.filial);

      const dadosCompletos = {
        titulo: gerarTitulo(),
        usuario_id: payload?.id || null,
        filial_id: filialSelecionada?.simpleId || null,
        checklist: checklistArray,
        ensaio: ensaioArray,
        id_ativo: true
      };

      // Enviar para o backend
      const response = await fetch(`${API_URL}/formularios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dadosCompletos)
      });

      if (!response.ok) throw new Error("Erro ao salvar no servidor");

      toast.success("Checklist salvo no servidor!");
      setForm(initialState);
      localStorage.removeItem("ensaioForm");
      localStorage.removeItem("checklistBombaForm");

      if (refreshFiles) refreshFiles();

    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar no servidor.");
    }
  };



  const handleCancel = () => {
    toast.warning("Operação Cancelada");
    setForm(initialState);
    localStorage.removeItem("ensaioForm");
  };

  return (
    <div className="container-ensaio my-4">
      <h1 className="title mb-4">Ensaio / Aferição</h1>
      <div className="mb-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {ensaioAfericaoItems.map((item) => (
          <ChecklistField
            key={item.id}
            item={item}
            formData={form}
            onChange={handleChange}
          />
        ))}
      </div>
      <div className="d-flex justify-content-end gap-2">
        <button className="btn btn-secondary" onClick={handleBack}>
          Voltar
        </button>
        <button className="btn btn-danger" onClick={handleCancel}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={handleConclude}>
          Concluir
        </button>
      </div>
    </div>
  );
}
