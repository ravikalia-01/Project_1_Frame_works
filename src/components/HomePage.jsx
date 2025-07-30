import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import Header from "./Header";
import "./homepage.css";

function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-container">
      <Header />
      
      {/* Main Content */}
      <main className="home-main">
        <div className="hero-section">
          <h1>Create a Professional Resume in Minutes</h1>
          <p className="hero-description">
            Welcome to the Smart Resume Builder. Easily enter your personal and professional information,
            preview your resume, and download a PDF with a few clicks!
          </p>
          
          {isAuthenticated ? (
            <div className="welcome-user">
              <h3>Welcome back, {user?.name}! 👋</h3>
              <p>Ready to continue building your professional resume?</p>
              <button className="start-btn" onClick={() => navigate("/builder")}>
                Continue Building
              </button>
            </div>
          ) : (
            <div className="guest-section">
              <p className="auth-prompt">
                Sign up or log in to save your progress and access your resumes anytime!
              </p>
              <button className="start-btn" onClick={() => navigate("/builder")}>
                Start Building
              </button>
            </div>
          )}
        </div>

        <div className="features-section">
          <h2>Why Choose Our Resume Builder?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🎨 Professional Templates</h3>
              <p>Choose from beautifully designed templates that make your resume stand out.</p>
            </div>
            <div className="feature-card">
              <h3>💾 Auto-Save</h3>
              <p>Your progress is automatically saved. Never lose your work again!</p>
            </div>
            <div className="feature-card">
              <h3>📱 Responsive Design</h3>
              <p>Build your resume on any device - desktop, tablet, or mobile.</p>
            </div>
            <div className="feature-card">
              <h3>🌙 Dark Mode</h3>
              <p>Switch between light and dark themes for comfortable viewing.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default HomePage;
