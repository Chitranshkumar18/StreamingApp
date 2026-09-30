import React, { createContext, useContext, useState, useEffect } from "react";
import { ENDPOINTS } from "../api/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check current session from backend on mount
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const response = await fetch(ENDPOINTS.AUTH.CURRENT_USER, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.data) {
            setUser(data.data);
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkCurrentUser();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await fetch(ENDPOINTS.AUTH.LOGOUT, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore network errors during logout
    } finally {
      setUser(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => (prev ? { ...prev, ...updatedData } : null));
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loading: isLoading,
    setIsLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
