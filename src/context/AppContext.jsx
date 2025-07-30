import React from "react";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";
import { ResumeProvider } from "./ResumeContext";

/**
 * Combined App Context Provider
 * This component wraps all context providers in the correct order
 * to provide a centralized state management system for the entire app
 */
export const AppProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ResumeProvider>
          {children}
        </ResumeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

// Export individual contexts for direct access if needed
export { useAuth } from "./AuthContext";
export { useTheme } from "./ThemeContext";
export { useResume } from "./ResumeContext";

export default AppProvider;
