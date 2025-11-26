import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import { useTasks } from './TaskContext'; // IMPORTANTE

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🟡 IMPORTANTE: para borrar tareas cuando el usuario cierre sesión
  const { clearTasks } = useTasks();

  // Verificar si hay sesión guardada al iniciar (por ahora no usamos AsyncStorage)
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulamos login exitoso
      const mockUser: User = {
        id: "1",
        name: "Usuario Demo",
        email,
      };

      setUser(mockUser);

      // Navegar a la app principal
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error en login:", error);
      throw new Error("Error al iniciar sesión");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const mockUser: User = {
        id: Date.now().toString(),
        name,
        email,
      };

      setUser(mockUser);

      // Navegar a la app principal
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error en registro:", error);
      throw new Error("Error al registrarse");
    }
  };

  const logout = () => {
    clearTasks();     // 🟢 LIMPIAR TODAS LAS TAREAS
    setUser(null);    // 🟢 Cerrar sesión
    router.replace("/(auth)/login"); // 🟢 Volver al login
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
}
