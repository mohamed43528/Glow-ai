"use client";

import { createContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [customer, setCustomer] = useState(null);

  useEffect(() => {
    try {
      const token = window.localStorage.getItem("glow-token");
      if (!token) return;

      const decoded = jwtDecode(token);
      setCustomer(decoded);
    } catch (err) {
      console.error("Invalid token", err);
    }
  }, []);

  const login = (token) => {
    try {
      window.localStorage.setItem("glow-token", token);
      const decoded = jwtDecode(token);
      setCustomer(decoded);
    } catch (err) {
      console.error("Login decode failed", err);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("glow-token");
    setCustomer(null);
  };

  return (
    <AuthContext.Provider value={{ customer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
