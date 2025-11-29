import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAI } from '@/lib/context/AIContext';
import { useTasks } from '@/lib/context/TaskContext';

interface Props {
  onSuccess?: () => void;
}

export default function SmartTaskCreator({ onSuccess }: Props) {
  const { createTaskFromPrompt, isLoading } = useAI();
  const { addTask } = useTasks();

  const [prompt, setPrompt] = useState('');
  const [preview, setPreview] = useState<{ title: string; description: string } | null>(null);

  // Generar preview de la tarea
  const handleGenerate = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Escribe algo para generar la tarea');
      return;
    }

    try {
      const result = await createTaskFromPrompt(prompt);
      setPreview(result);
    } catch (error) {
      console.error('Error al generar tarea:', error);
      Alert.alert('Error', 'No se pudo generar la tarea. Verifica tu API Key.');
    }
  };

  // Crear la tarea final
  const handleCreate = async () => {
    if (!preview) return;

    try {
      await addTask({
        title: preview.title,
        description: preview.description,
        completed: false,
      });

      Alert.alert('✅ Tarea creada', 'La IA generó tu tarea exitosamente');
      setPrompt('');
      setPreview(null);
      onSuccess?.();
    } catch (error) {
      console.error('Error al crear tarea:', error);
      Alert.alert('Error', 'No se pudo crear la tarea');
    }
  };

  const handleCancel = () => {
    setPreview(null);
    setPrompt('');
  };

  return (
    <View className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-2xl">
      <Text className="text-2xl font-bold mb-1">✨ Crear con IA</Text>
      <Text className="text-gray-600 mb-4 text-sm">
        Describe lo que necesitas hacer en lenguaje natural
      </Text>

      {/* Input de prompt */}
      <TextInput
        className="bg-white p-4 rounded-xl border border-gray-200 mb-3"
        placeholder="Ej: Necesito preparar una presentación para el lunes..."
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={3}
        editable={!isLoading && !preview}
      />

      {/* Preview de tarea generada */}
      {preview && (
        <View className="bg-white p-4 rounded-xl border-2 border-purple-300 mb-3">
          <Text className="text-xs font-semibold text-purple-600 mb-2">VISTA PREVIA</Text>
          <Text className="font-bold text-lg mb-1">{preview.title}</Text>
          <Text className="text-gray-600">{preview.description}</Text>
        </View>
      )}

      {/* Botones */}
      {isLoading ? (
        <View className="items-center py-4">
          <ActivityIndicator size="large" color="#8b5cf6" />
          <Text className="text-gray-500 mt-2">Generando tarea...</Text>
        </View>
      ) : preview ? (
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handleCreate}
            className="flex-1 bg-green-500 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-bold">✓ Crear Tarea</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancel}
            className="flex-1 bg-gray-300 py-3 rounded-xl"
          >
            <Text className="text-gray-700 text-center font-bold">Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleGenerate}
          className="bg-purple-600 py-4 rounded-xl"
          disabled={!prompt.trim()}
        >
          <Text className="text-white text-center font-bold">🤖 Generar con IA</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}