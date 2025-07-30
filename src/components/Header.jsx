import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../context/AppContext";
import "./header.css";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, user, login, register, logout, loading, error, clearError } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    await login(loginForm.email, loginForm.password);
    if (!error) {
      setShowLoginModal(false);
      setLoginForm({ email: "", password: "" });
    }
  };

  // Handle register form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      return;
    }
    await register({
      name: registerForm.name,
      email: registerForm.email,
      password: registerForm.password
    });
    if (!error) {
      setShowRegisterModal(false);
      setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close modals and clear errors
  const closeModals = () => {
    setShowLoginModal(false);
    setShowRegisterModal(false);
    clearError();
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ name: "", email: "", password: "", confirmPassword: "" });
  };

  // Switch between login and register modals
  const switchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
    clearError();
  };

  const switchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
    clearError();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src="./src/assets/logo.png" alt="Logo" className="navbar-logo" />
          <span className="navbar-title">RK Smart Resume Builder</span>
        </div>

        <div className="navbar-center">
          <button onClick={() => navigate("/")}>Home</button>
          <button onClick={() => navigate("/builder")}>Resume Builder</button>
          <button onClick={() => navigate("/preview")}>Resume Preview</button>
        </div>

        <div className="navbar-right">
          {/* Theme Toggle Button */}
          <button 
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {/* Authentication Buttons */}
          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-greeting">Hello, {user?.name}!</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <button 
                className="login-btn"
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
              <button 
                className="register-btn"
                onClick={() => setShowRegisterModal(true)}
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="button-group">
                <button type="button" className="btn-secondary" onClick={closeModals}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
            <div className="switch-mode">
              Don't have an account? 
              <button type="button" onClick={switchToRegister}>Sign up here</button>
            </div>
          </div>
        </div>
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <div className="modal-overlay" onClick={closeModals}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Sign Up</h2>
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  required
                />
              </div>
              {registerForm.password !== registerForm.confirmPassword && registerForm.confirmPassword && (
                <div className="error-message">Passwords do not match</div>
              )}
              {error && <div className="error-message">{error}</div>}
              <div className="button-group">
                <button type="button" className="btn-secondary" onClick={closeModals}>
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  disabled={loading || registerForm.password !== registerForm.confirmPassword}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
                </button>
              </div>
            </form>
            <div className="switch-mode">
              Already have an account? 
              <button type="button" onClick={switchToLogin}>Login here</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
