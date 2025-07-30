import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state for theme
const initialThemeState = {
  theme: "light", // 'light' or 'dark'
  themes: {
    light: {
      name: "Light",
      colors: {
        primary: "#007bff",
        secondary: "#6c757d",
        success: "#28a745",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#17a2b8",
        background: "#ffffff",
        surface: "#f8f9fa",
        text: "#212529",
        textSecondary: "#6c757d",
        border: "#dee2e6",
        shadow: "rgba(0, 0, 0, 0.1)",
      },
    },
    dark: {
      name: "Dark",
      colors: {
        primary: "#0d6efd",
        secondary: "#6c757d",
        success: "#198754",
        danger: "#dc3545",
        warning: "#ffc107",
        info: "#0dcaf0",
        background: "#121212",
        surface: "#1e1e1e",
        text: "#ffffff",
        textSecondary: "#adb5bd",
        border: "#495057",
        shadow: "rgba(0, 0, 0, 0.3)",
      },
    },
  },
};

// Action types for theme
const themeActionTypes = {
  SET_THEME: "SET_THEME",
  TOGGLE_THEME: "TOGGLE_THEME",
  LOAD_THEME: "LOAD_THEME",
};

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case themeActionTypes.SET_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    case themeActionTypes.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };

    case themeActionTypes.LOAD_THEME:
      return {
        ...state,
        theme: action.payload,
      };

    default:
      return state;
  }
};

// Create Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialThemeState);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("resumeApp_theme") || "light";
    dispatch({
      type: themeActionTypes.LOAD_THEME,
      payload: savedTheme,
    });
  }, []);

  // Apply theme to CSS variables and save to localStorage
  useEffect(() => {
    const currentTheme = state.themes[state.theme];
    const root = document.documentElement;

    // Set CSS custom properties
    Object.entries(currentTheme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Set theme class on body
    document.body.className = `theme-${state.theme}`;

    // Save to localStorage
    localStorage.setItem("resumeApp_theme", state.theme);
  }, [state.theme, state.themes]);

  // Action creators
  const setTheme = (themeName) => {
    if (state.themes[themeName]) {
      dispatch({
        type: themeActionTypes.SET_THEME,
        payload: themeName,
      });
    }
  };

  const toggleTheme = () => {
    dispatch({ type: themeActionTypes.TOGGLE_THEME });
  };

  const getCurrentTheme = () => {
    return state.themes[state.theme];
  };

  const value = {
    ...state,
    setTheme,
    toggleTheme,
    getCurrentTheme,
    currentTheme: state.themes[state.theme],
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeContext;
