import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { LoginSchema } from "@/lib/schemas/AuthSchema";
import { useAuth } from "@/lib/context/AuthContext";
import { router } from "expo-router";

export default function LoginScreen() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleLogin = async () => {
    setErrors({}); // limpia errores previos

    const result = LoginSchema.safeParse({ email, password });

    if (!result.success) {
      const newErrors: any = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        newErrors[field] = issue.message;
      });

      setErrors(newErrors);
      return;
    }

    // Simular registro → loguear automáticamente
        login(result.data.email,result.data.password);
        router.replace("/(tabs)");
      };

  return (
    <View className="p-6">
      <Text className="text-2xl font-bold mb-6">Iniciar Sesión</Text>

      <TextInput
        className="border rounded-xl p-3 mb-2"
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />
      {errors.email && <Text className="text-red-500">{errors.email}</Text>}

      <TextInput
        className="border rounded-xl p-3 mt-3"
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errors.password && <Text className="text-red-500">{errors.password}</Text>}

      <TouchableOpacity
        className="bg-black p-4 rounded-xl mt-6"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-semibold">Entrar</Text>
      </TouchableOpacity>
    </View>
  );
}
