import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Input from "@/components/ui/Input";
import { router } from "expo-router";
import { useAuth } from "@/lib/context/AuthContext";
import {loginSchema} from "@/lib/schemas/loginSchema";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [issues, setIssues] = useState<any>({});

  const handleLogin = async () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setIssues(result.error.flatten().fieldErrors);
      return;
    }

    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch {
      setIssues({ general: "Credenciales incorrectas" });
    }
  };

  return (
    <View className="flex-1 justify-center px-8 bg-white">
      <Text className="text-3xl font-bold text-blue-600 mb-6">Login</Text>

      <Input
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        className="mb-2"
      />
      {issues.email && (
        <Text className="text-red-500 mb-2 text-sm">{issues.email}</Text>
      )}

      <Input
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        className="mb-2"
        secureTextEntry
      />
      {issues.password && (
        <Text className="text-red-500 mb-2 text-sm">{issues.password}</Text>
      )}

      {issues.general && (
        <Text className="text-red-500 mb-2 text-sm">{issues.general}</Text>
      )}

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-600 p-3 rounded-lg mt-4"
      >
        <Text className="text-white text-center font-semibold">Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("/(auth)/register")}
        className="mt-4"
      >
        <Text className="text-blue-600 text-center">
          Crear nueva cuenta
        </Text>
      </TouchableOpacity>
    </View>
  );
}
