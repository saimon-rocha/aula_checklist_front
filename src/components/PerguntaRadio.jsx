import React from "react";
import "../styles/PerguntaRadio.css"; // usar import normal

export default function PerguntaRadio({ label, selectedValue, onChange }) {
  return (
    <div className="perguntaContainer">
      <span className="questionLabel">{label}</span>

      <div className="toggleSwitch" onClick={() => onChange(selectedValue === "sim" ? "nao" : "sim")}>
        <div className={`toggleTrack ${selectedValue}`}>
          <div className="toggleThumb"></div>
        </div>
        <div className="toggleLabels">
          <span className="labelSim">Sim</span>
          <span className="labelNao">Não</span>
        </div>
      </div>
    </div>
  );
}

