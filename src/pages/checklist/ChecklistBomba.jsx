import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/Card.jsx";
import PerguntaRadio from "../../components/PerguntaRadio.jsx";
import PerguntaTexto from "../../components/PerguntaTexto.jsx";
import "../../styles/ChecklistBomba.css";
import { checklistItems } from "../../utils/checklistStructure.js";
import PerguntaRadioDefeito from "../../components/PerguntaRadioDefeito.jsx";
import TopFields from "../../components/TopFields.jsx";
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
          placeholder={item.placeholder}
          value={formData[item.id]}
          onChange={(val) => onChange(item.id, val)}
        />
      )}
    </Card>
  );
};

export default function ChecklistBomba() {
  const navigate = useNavigate();

  const initialState = checklistItems.reduce((acc, item) => {
    if (item.type === "checkbox") acc[item.id] = [];
    else if (item.type === "radio") acc[item.id] = "nao";
    else acc[item.id] = "";
    return acc;
  }, { bombaId: "", data: "" });

  const [form, setForm] = useState(() => {
    // tenta carregar do localStorage
    const saved = localStorage.getItem("checklistBombaForm");
    return saved ? JSON.parse(saved) : initialState;
  });

  const handleChange = (field, value) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);
    localStorage.setItem("checklistBombaForm", JSON.stringify(newForm));
  };

  const handleAvancar = () => {
    navigate("/ensaio", { state: { primeiroForm: form } });
  };

  const handleCancelar = () => {
    toast.warn("Operação Cancelada"); // AVISOS
    setForm(initialState);
    localStorage.removeItem("checklistBombaForm");
  };

  return (
    <div className="container-checklist">
      <h1 className="title">Checklist da Bomba Medidora</h1>

      <TopFields formData={form} onChange={handleChange} />

      <div className="mb-4" style={{ maxHeight: "60vh", overflowY: "auto" }}>
        {checklistItems.map((item) => (
          <ChecklistField
            key={item.id}
            item={item}
            formData={form}
            onChange={handleChange}
          />
        ))}

        <div className="d-flex justify-content-end gap-2">
          <button className="btn btn-secondary" onClick={handleCancelar}>
            Cancelar
          </button>
          <button className="btn btn-primary" onClick={handleAvancar}>
            Avançar
          </button>
        </div>
      </div>
    </div>
  );
}
