import React, { useState } from "react";
import { createBrowserRouter, RouterProvider, redirect } from "react-router-dom";
import Arquivos from './pages/arquivos/Arquivos';
import ChecklistBomba from './pages/checklist/ChecklistBomba';
import EnsaioAfericao from './pages/checklist/EnsaioAfericao';
import Filial from './pages/filial/Filial';
import Cadastro from './pages/usuarios/Cadastro';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PrivateLayout from './components/PrivateLayout';
import ListaUser from './pages/usuarios/ListaUser';
import ListaFilial from './pages/filial/ListFilial';
import "./styles/App.css";
import { ToastContainer } from 'react-toastify';

function requireAuth() {
  const token = localStorage.getItem("token");
  if (!token) return redirect("/login");
  return null; // Se houver token, deixa passar
}

function App() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const router = createBrowserRouter([
    {
      path: "/",
      loader: () => redirect("/login"), // Sempre redireciona para login na primeira carga
    },
    {
      path: "/login",
      element: (
        <Login
          email={email}
          setemail={setEmail}
          senha={senha}
          setsenha={setSenha}
        />
      ),
    },
    {
      path: "/",
      element: <PrivateLayout />,
      loader: requireAuth,
      children: [
        { path: "checklist", element: <ChecklistBomba /> },
        { path: "ensaio", element: <EnsaioAfericao /> },
        { path: "listuser", element: <ListaUser /> },
        { path: "arquivos", element: <Arquivos /> },
        { path: "listfilial", element: <ListaFilial /> },
        { path: "cadfilial", element: <Filial /> },
        { path: "caduser", element: <Cadastro /> },
      ],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ]);

  // return <RouterProvider router={router} />;
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;