import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { House, FileEarmarkText, People, Building, BoxArrowRight } from "react-bootstrap-icons";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Menu.css";

const Menu = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(payload.id_admin === true); // se for admin, true
      } catch (err) {
        console.error("Erro ao ler token:", err);
        setIsAdmin(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar className={`navbarCustom ${show ? "navbarShow" : "navbarHide"}`}>
      <div className="container-menu">
        <Nav className="navInner">
          <Nav.Link as={Link} to="/checklist" className="navItemCustom">
            <House size={22} />
            <div>Home</div>
          </Nav.Link>

          <Nav.Link as={Link} to="/arquivos" className="navItemCustom">
            <FileEarmarkText size={22} />
            <div>Formulário</div>
          </Nav.Link>

          {/* Só aparece para admin */}
          {isAdmin && (
            <>
              <Nav.Link as={Link} to="/listuser" className="navItemCustom">
                <People size={22} />
                <div>Usuários</div>
              </Nav.Link>

              <Nav.Link as={Link} to="/listfilial" className="navItemCustom">
                <Building size={22} />
                <div>Filial</div>
              </Nav.Link>
            </>
          )}

          <Nav.Link onClick={handleLogout} className="navItemCustom">
            <BoxArrowRight size={22} />
            <div>Sair</div>
          </Nav.Link>
        </Nav>
      </div>
    </Navbar>
  );
};

export default Menu;
