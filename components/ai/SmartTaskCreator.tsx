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
import { useTheme } from '@/lib/context/ThemeContext';

interface Props {
  onSuccess?: () => void;
}

export default function SmartTaskCreator({ onSuccess }: Props) {
  const { createTaskFromPrompt, isLoading } = useAI();
  const { addTask } = useTasks();
  const { currentTheme } = useTheme();

  const [prompt, setPrompt] = useState('');
  const [preview, setPreview] = useState<{ title: string; description: string } | null>(null);

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

  const handleCreate = async () => {
    if (!preview) return;

    try {
      await addTask({
        title: preview.title,
        description: preview.description,
        completed: false,
      });

      Alert.alert('Tarea creada', 'La IA generó tu tarea exitosamente');
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
    <View
      style={{
        backgroundColor: currentTheme.colors.ai + '20',
        borderColor: currentTheme.colors.ai,
      }}
      className="p-5 rounded-2xl border"
    >
      <Text style={{ color: currentTheme.colors.text }} className="text-2xl font-bold mb-1">
        Crear con IA
      </Text>
      <Text style={{ color: currentTheme.colors.textSecondary }} className="mb-4 text-sm">
        Describe lo que necesitas hacer en lenguaje natural
      </Text>

      {/* Input de prompt */}
      <TextInput
        style={{
          backgroundColor: currentTheme.colors.surface,
          color: currentTheme.colors.text,
          borderColor: currentTheme.colors.border,
        }}
        className="p-4 rounded-xl border mb-3"
        placeholder="Ej: Necesito preparar una presentación para el lunes..."
        placeholderTextColor={currentTheme.colors.textSecondary}
        value={prompt}
        onChangeText={setPrompt}
        multiline
        numberOfLines={3}
        editable={!isLoading && !preview}
      />

      {/* Preview de tarea generada */}
      {preview && (
        <View
          style={{
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.ai,
          }}
          className="p-4 rounded-xl border-2 mb-3"
        >
          <Text style={{ color: currentTheme.colors.ai }} className="text-xs font-semibold mb-2">
            VISTA PREVIA
          </Text>
          <Text style={{ color: currentTheme.colors.text }} className="font-bold text-lg mb-1">
            {preview.title}
          </Text>
          <Text style={{ color: currentTheme.colors.textSecondary }}>{preview.description}</Text>
        </View>
      )}

      {/* Botones */}
      {isLoading ? (
        <View className="items-center py-4">
          <ActivityIndicator size="large" color={currentTheme.colors.ai} />
          <Text style={{ color: currentTheme.colors.textSecondary }} className="mt-2">
            Generando tarea...
          </Text>
        </View>
      ) : preview ? (
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={handleCreate}
            style={{ backgroundColor: currentTheme.colors.success }}
            className="flex-1 py-3 rounded-xl"
          >
            <Text className="text-white text-center font-bold">✓ Crear Tarea</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancel}
            style={{ backgroundColor: currentTheme.colors.secondary }}
            className="flex-1 py-3 rounded-xl"
          >
            <Text style={{ color: currentTheme.colors.text }} className="text-center font-bold">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleGenerate}
          style={{ backgroundColor: currentTheme.colors.ai }}
          className="py-4 rounded-xl"
          disabled={!prompt.trim()}
        >
          <Text style={{ color: currentTheme.colors.aiText }} className="text-center font-bold">
            Generar con IA
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}