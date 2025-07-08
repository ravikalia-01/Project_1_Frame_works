import React from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

function Header() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="./src/assets/logo.png" alt="Logo" className="navbar-logo" />
        <span className="navbar-title">RK Smart Resume Builder</span>
      </div>

      <div className="navbar-right">
        <button onClick={() => navigate("/")}>Home</button>
        <button onClick={() => navigate("/builder")}>Resume Builder</button>
        <button onClick={() => navigate("/preview")}>Resume Preview</button>
      </div>
    </nav>
  );
}

export default Header;
