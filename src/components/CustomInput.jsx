// src/components/CustomInput.jsx
import React from "react";

const CustomInput = ({ value, setValue, placeholder, secureTextEntry }) => {
  return (
    <div
      style={{
        backgroundColor: "#f2f2f2",
        width: "100%",
        border: "1px solid #e8e8e8",
        borderRadius: "10px",
        padding: "0 15px",
        margin: "8px 0",
      }}
    >
      <input
        type={secureTextEntry ? "senha" : "text"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        style={{
          height: "50px",
          width: "100%",
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "16px",
          color: "#333",
        }}
      />
    </div>
  );
};

export default CustomInput;
