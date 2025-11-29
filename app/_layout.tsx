import { Slot } from "expo-router";
import { TaskProvider } from "@/lib/context/TaskContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { AIProvider } from "@/lib/context/AIContext";
import { ThemeProvider } from "@/lib/context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TaskProvider>
          <AIProvider>
            <Slot />
          </AIProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}