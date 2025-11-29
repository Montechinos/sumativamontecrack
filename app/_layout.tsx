import { Slot } from "expo-router";
import { TaskProvider } from "@/lib/context/TaskContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { AIProvider } from "@/lib/context/AIContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AIProvider>
          <Slot />
        </AIProvider>
      </TaskProvider>
    </AuthProvider>
  );
}