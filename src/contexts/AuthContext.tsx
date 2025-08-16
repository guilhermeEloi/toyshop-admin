/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import api from "@/services";

interface User {
  id: number;
  username: string;
}

interface JwtPayload {
  sub: number;
  username: string;
  exp: number;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = Cookies.get("access_token");
    const savedUser = Cookies.get("user");

    if (savedToken && savedUser) {
      try {
        const decoded = jwtDecode<JwtPayload>(savedToken);
        if (decoded.exp && Date.now() < decoded.exp * 1000) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        } else {
          Cookies.remove("access_token");
          Cookies.remove("user");
        }
      } catch {
        Cookies.remove("access_token");
        Cookies.remove("user");
      }
    }

    setLoading(false);
  }, []);

  const isTokenValid = (token: string | null) => {
    if (!token) return false;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp ? Date.now() < decoded.exp * 1000 : false;
    } catch {
      return false;
    }
  };

  const isAuthenticated = () => token !== null && isTokenValid(token);

  const login = async (username: string, password: string) => {
    const { data } = await api.post("/auth/login", { username, password });
    Cookies.set("access_token", data.access_token, {
      secure: true,
      sameSite: "Strict",
    });
    Cookies.set("user", JSON.stringify(data.user), {
      secure: true,
      sameSite: "Strict",
    });
    setToken(data.access_token);
    setUser(data.user);
  };

  const register = async (username: string, password: string) => {
    await api.post("/auth/register", { username, password });
    await login(username, password);
  };

  const logout = () => {
    Cookies.remove("access_token");
    Cookies.remove("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, register, logout, isAuthenticated, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
};
