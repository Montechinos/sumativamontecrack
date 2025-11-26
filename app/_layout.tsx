import { Stack } from "expo-router";
import { AuthProvider } from "../lib/context/AuthContext";
import { TaskProvider } from "../lib/context/TaskContext";

export default function RootLayout() {
  return (
    <TaskProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </TaskProvider>
  );
}
