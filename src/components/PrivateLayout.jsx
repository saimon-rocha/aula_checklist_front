// src/layouts/PrivateLayout.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Menu from "../components/Menu";
import '../styles/PrivateLayout.css';

const PrivateLayout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Menu />
      {/* Espaçamento controlado pelo layout, não pelo body */}
      <div className="layoutContent">
        <Outlet />
      </div>
    </>
  );
};

export default PrivateLayout;
