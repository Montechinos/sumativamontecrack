import React, { createContext, useContext, useState } from "react";
import { router } from "expo-router";
import { useTasks } from "@/lib/context/TaskContext";

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: User & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading] = useState(false);

  // IMPORTANTE: usar clearTasks para borrar tareas al cerrar sesión
  const { clearTasks } = useTasks();

  const login = async (email: string, password: string) => {
    // Simulación de login local
    setUser({ name: "Usuario Demo", email });
    // Navegar a tabs
    router.replace("/(tabs)");
  };

  const register = async (data: User & { password: string }) => {
    setUser({ name: data.name, email: data.email });
    router.replace("/(tabs)");
  };

  const logout = async () => {
    try {
      // limpiar tareas primero
      try {
        clearTasks();
      } catch (e) {
        // si clearTasks falla por alguna razón, seguimos con el logout
        console.warn("clearTasks fallo:", e);
      }

      setUser(null);
      // redirigir al auth group (login/register)
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return ctx;
}
