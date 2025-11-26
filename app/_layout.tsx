import { Slot } from "expo-router";
import { TaskProvider } from "@/lib/context/TaskContext";
import { AuthProvider } from "@/lib/context/AuthContext";

export default function RootLayout() {
  return (
    <TaskProvider>
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </TaskProvider>
  );
}
