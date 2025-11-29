import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { GoogleGenAI } from "@google/genai";
import { useTasks } from "../context/TaskContext";

export const TaskAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { addTask } = useTasks();

  const APIKEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  const askGemini = async (text: string) => {
    if (!text.trim()) {
      setError("Escribe una pregunta o instrucción");
      return;
    }

    setError("");
    setResponse("");
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: APIKEY || "" });

      const context = `
Eres un asistente experto en organización y productividad.
Ayudas al usuario a crear, ordenar y planificar tareas.
Responde en máximo 4 líneas.
Pregunta del usuario: ${text}
`;

      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: context,
      });

      if (result.text) {
        setResponse(result.text);
      } else {
        throw new Error("No se recibió respuesta del modelo");
      }
    } catch (err) {
      console.log("Error IA:", err);
      setError("No se pudo obtener respuesta. Revisa tu API KEY.");
    } finally {
      setIsLoading(false);
    }
  };

  const quick = [
    "¿Cuál debería ser mi primera tarea del día?",
    "Organiza mis pendientes en orden de prioridad",
    "¿Cómo evito procrastinar?",
    "Dame un plan rápido para estudiar o trabajar",
  ];

  const createTaskWithAI = async () => {
    if (!response) return;

    await addTask({
      title: "Sugerencia IA",
      description: response,
      completed: false,
    });

    alert("Tarea creada con la respuesta de la IA ");
  };

  return (
    <View className="bg-white p-4 mt-4 border-t-2 border-gray-300 rounded-lg">

      <Text className="text-xl font-black text-gray-900 mb-3">
         Asistente IA de Tareas
      </Text>

      {/* Preguntas rápidas */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
        <View className="flex-row gap-2">
          {quick.map((q, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => {
                setPrompt(q);
                askGemini(q);
              }}
              className="bg-blue-100 px-3 py-2 rounded-xl border border-blue-400"
            >
              <Text className="text-blue-700 font-bold text-xs">{q}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Input */}
      <View className="flex-row gap-2 mb-3">
        <TextInput
          className="flex-1 bg-gray-100 p-3 rounded-lg border-2 border-gray-300 font-bold"
          placeholder="Pregúntale a la IA cómo organizarte..."
          placeholderTextColor="#9CA3AF"
          value={prompt}
          onChangeText={setPrompt}
        />

        <TouchableOpacity
          onPress={() => askGemini(prompt)}
          disabled={isLoading}
          className="px-4 py-3 rounded-lg bg-blue-600"
        >
          <Text className="text-white font-black text-lg">
            {isLoading ? "…" : "→"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Cargando */}
      {isLoading && (
        <View className="bg-blue-50 p-3 rounded-lg border border-blue-300 mb-3">
          <ActivityIndicator color="#2563eb" />
          <Text className="text-blue-700 font-bold text-center mt-1">
            Pensando…
          </Text>
        </View>
      )}

      {/* Error */}
      {error !== "" && (
        <View className="bg-red-100 p-3 rounded-lg border border-red-300 mb-3">
          <Text className="text-red-700 font-bold"> {error}</Text>
        </View>
      )}

      {/* Respuesta */}
      {response !== "" && !isLoading && (
        <View className="bg-blue-50 p-4 rounded-lg border border-blue-300">
          <Text className="text-blue-700 font-black mb-2">Respuesta IA:</Text>
          <Text className="text-gray-800">{response}</Text>

          {/* Botón para crear tarea desde IA */}
          <TouchableOpacity
            onPress={createTaskWithAI}
            className="bg-green-500 mt-3 p-2 rounded-lg"
          >
            <Text className="text-white text-center font-bold">
              Convertir respuesta en Tarea
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};
