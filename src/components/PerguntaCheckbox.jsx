import React from "react";
import "../styles/PerguntaCheckbox.css";

export default function PerguntaCheckbox({ label, options, selectedValues, onChange }) {
  const handleToggle = (option) => {
    const newValues = selectedValues.includes(option)
      ? selectedValues.filter((v) => v !== option)
      : [...selectedValues, option];
    onChange(newValues);
  };

  return (
    <div className="perguntaContainer">
      <span className="questionLabel">{label}</span>
      <div className="checkboxGroup">
        {options.map((option) => (
          <label key={option} className="checkboxLabel">
            <input
              type="checkbox"
              checked={selectedValues.includes(option)}
              onChange={() => handleToggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
