/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import api from "@/services";

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedToken = Cookies.get("access_token");
    const savedUser = Cookies.get("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
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
    } catch (err: any) {
      if (err.response?.status === 401) {
        throw new Error(err.response.data.message || "Credenciais inválidas");
      }
      throw err;
    }
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
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
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
