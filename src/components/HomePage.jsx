import React from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Navigation Bar */}
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

      {/* Main Content */}
      <main className="home-main">
        <h2>Create a Professional Resume in Minutes</h2>
        <p>
          Welcome to the Smart Resume Builder. Easily enter your personal and professional information,
          preview your resume, and download a PDF with a few clicks!
        </p>
        <button className="start-btn" onClick={() => navigate("/builder")}>
          Start Building
        </button>
      </main>
    </div>
  );
}

export default HomePage;
