// src/components/CustomButton.jsx
import React, { useState, useEffect } from "react";

const CustomButton = ({ onClick, text }) => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    function simulateNetworkRequest() {
      return new Promise((resolve) => {
        setTimeout(resolve, 2000); // simula 2 segundos de espera
      });
    }

    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleClick = () => {
    setLoading(true);
    if (onClick) onClick(); // executa callback passado pelo pai
  };

  return (
    <button
      onClick={!isLoading ? handleClick : null}
      disabled={isLoading}
      style={{
        backgroundColor: "#3b71f3",
        width: "100%",
        padding: "8px",
        margin: "10px 0",
        border: "none",
        borderRadius: "10px",
        color: "white",
        fontWeight: "bold",
        fontSize: "14px",
        cursor: isLoading ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.7 : 1,
      }}
    >
      {isLoading ? "Loading…" : text}
    </button>
  );
};

export default CustomButton;
