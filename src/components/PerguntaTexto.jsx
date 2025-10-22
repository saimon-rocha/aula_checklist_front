import React from "react";
import "../styles/PerguntaTexto.css";

export default function PerguntaTexto({ label, subtitle, placeholder, value, onChange, readOnly, numeric }) {
  const handleChange = (e) => {
    let val = e.target.value;
    if (numeric) {
      // permite apenas números positivos ou negativos
      if (/^-?\d*$/.test(val)) {
        onChange(val);
      }
      return;
    }
    onChange(val);
  };

  return (
    <div className="perguntaTexto">
      {label && <label className="perguntaLabel">{label}</label>}
      {subtitle && <span className="perguntaSubtitle">{subtitle}</span>}
      <input
        className="perguntaInput"
        placeholder={placeholder}
        value={value}
        onChange={readOnly ? undefined : handleChange}
        type="text"
        readOnly={readOnly}
      />
    </div>
  );
}
