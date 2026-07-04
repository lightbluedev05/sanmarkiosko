"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api, User } from "./api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password?: string;
    faculty?: string;
    career?: string;
    year?: string;
    bio?: string;
  }) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar si hay una sesión activa al cargar la página
  useEffect(() => {
    const checkSession = async () => {
      const storedToken = localStorage.getItem("sanmarkiosko_token");
      if (storedToken) {
        setToken(storedToken);
        try {
          const res = await api.auth.me();
          if (res.success) {
            setUser(res.data.user);
          } else {
            // Token inválido/expirado
            logout();
          }
        } catch (error) {
          console.error("Error al restaurar sesión:", error);
          logout();
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password?: string) => {
    try {
      const res = await api.auth.login({ email, password });
      if (res.success && res.data.token) {
        localStorage.setItem("sanmarkiosko_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        router.push("/");
      }
    } catch (error) {
      console.error("Error en login:", error);
      throw error;
    }
  };

  // Función para registrar un nuevo estudiante
  const register = async (userData: {
    name: string;
    email: string;
    password?: string;
    faculty?: string;
    career?: string;
    year?: string;
    bio?: string;
  }) => {
    try {
      const res = await api.auth.register(userData);
      if (res.success && res.data.token) {
        localStorage.setItem("sanmarkiosko_token", res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        router.push("/");
      }
    } catch (error) {
      console.error("Error en registro:", error);
      throw error;
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem("sanmarkiosko_token");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  // Refrescar perfil del usuario actual (útil después de editar perfil)
  const refreshUser = async () => {
    try {
      const res = await api.auth.me();
      if (res.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error al actualizar datos de usuario:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
