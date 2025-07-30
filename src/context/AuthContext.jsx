import React, { createContext, useContext, useReducer, useEffect } from "react";

// Initial state for authentication
const initialAuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  users: [], // Store registered users (in real app, this would be backend)
};

// Action types for authentication
const authActionTypes = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  CLEAR_ERROR: "CLEAR_ERROR",
  LOAD_USER_DATA: "LOAD_USER_DATA",
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case authActionTypes.LOGIN_START:
    case authActionTypes.REGISTER_START:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case authActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };

    case authActionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        users: [...state.users, action.payload.user],
        isAuthenticated: true,
        user: action.payload.user,
        loading: false,
        error: null,
      };

    case authActionTypes.LOGIN_FAILURE:
    case authActionTypes.REGISTER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false,
        user: null,
      };

    case authActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };

    case authActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case authActionTypes.LOAD_USER_DATA:
      return {
        ...state,
        users: action.payload.users || [],
        isAuthenticated: action.payload.isAuthenticated || false,
        user: action.payload.user || null,
      };

    default:
      return state;
  }
};

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem("resumeApp_users") || "[]");
    const savedUser = JSON.parse(localStorage.getItem("resumeApp_currentUser") || "null");
    const isAuthenticated = !!savedUser;

    dispatch({
      type: authActionTypes.LOAD_USER_DATA,
      payload: {
        users: savedUsers,
        user: savedUser,
        isAuthenticated,
      },
    });
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("resumeApp_users", JSON.stringify(state.users));
    if (state.user) {
      localStorage.setItem("resumeApp_currentUser", JSON.stringify(state.user));
    } else {
      localStorage.removeItem("resumeApp_currentUser");
    }
  }, [state.users, state.user]);

  // Action creators
  const login = async (email, password) => {
    dispatch({ type: authActionTypes.LOGIN_START });

    // Simulate API call delay
    setTimeout(() => {
      const user = state.users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        dispatch({
          type: authActionTypes.LOGIN_SUCCESS,
          payload: userWithoutPassword,
        });
      } else {
        dispatch({
          type: authActionTypes.LOGIN_FAILURE,
          payload: "Invalid email or password",
        });
      }
    }, 1000);
  };

  const register = async (userData) => {
    dispatch({ type: authActionTypes.REGISTER_START });

    // Simulate API call delay
    setTimeout(() => {
      const existingUser = state.users.find((u) => u.email === userData.email);

      if (existingUser) {
        dispatch({
          type: authActionTypes.REGISTER_FAILURE,
          payload: "User with this email already exists",
        });
      } else {
        const newUser = {
          id: Date.now().toString(),
          ...userData,
          createdAt: new Date().toISOString(),
        };

        const { password: _, ...userWithoutPassword } = newUser;

        dispatch({
          type: authActionTypes.REGISTER_SUCCESS,
          payload: { user: userWithoutPassword },
        });
      }
    }, 1000);
  };

  const logout = () => {
    dispatch({ type: authActionTypes.LOGOUT });
  };

  const clearError = () => {
    dispatch({ type: authActionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
