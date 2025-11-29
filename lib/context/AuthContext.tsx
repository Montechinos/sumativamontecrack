import { createContext, useState, useContext } from "react";
import { router } from "expo-router";

interface AuthContextType {
  user: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    if (email.length < 3 || password.length < 3) {
      throw new Error("Credenciales inválidas");
    }

    setUser(email);
    router.replace("../tabs");
  };

  const register = async (email: string, password: string) => {
    if (email.length < 3 || password.length < 3) {
      throw new Error("Datos incorrectos");
    }

    setUser(email);
    router.replace("../tabs");
  };

  const logout = () => {
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
