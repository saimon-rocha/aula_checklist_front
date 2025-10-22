import React from "react";
import "../styles/PerguntaRadio.css";

export default function PerguntaRadioDefeito({ label, selectedValue, onChange }) {
  return (
    <div className="perguntaContainer">
      <span className="questionLabel">{label}</span>

      <div
        className="toggleSwitch"
        onClick={() => onChange(selectedValue === "sim" ? "nao" : "sim")} >
        {/* Aqui a mágica: se selectedValue = nao → cor verde, se sim → cor vermelha */}
        <div className={`toggleTrack ${selectedValue === "sim" ? "nao" : "sim"}`}>
          <div className="toggleThumb"></div>
        </div>

        {/* Labels invertidas */}
        <div className="toggleLabels">
          <span className="labelSim">Não</span>
          <span className="labelNao">Sim</span>
        </div>
      </div>
    </div>
  );
}
