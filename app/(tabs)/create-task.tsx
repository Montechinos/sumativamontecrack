import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useTasks } from '@/lib/context/TaskContext';
import { router } from 'expo-router';

export default function CreateTaskScreen() {
  const { addTask } = useTasks();  // ← IMPORTANTE
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });

  const validateAlphanumeric = (text: string) => {
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    return alphanumericRegex.test(text);
  };

  const handleCreateTask = async () => {
    let valid = true;
    const newErrors = { title: '', description: '' };

    if (!title.trim()) {
      newErrors.title = 'El título es requerido';
      valid = false;
    } else if (!validateAlphanumeric(title)) {
      newErrors.title = 'Solo caracteres alfanuméricos permitidos';
      valid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'La descripción es requerida';
      valid = false;
    } else if (!validateAlphanumeric(description)) {
      newErrors.description = 'Solo caracteres alfanuméricos permitidos';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    // 👇 **GUARDAR TAREA EN EL CONTEXTO**
    await addTask({
      title: title.trim(),
      description: description.trim(),
      completed: false
    });

    Alert.alert('Éxito', 'Tarea creada correctamente');

    // Volver al tab principal
    router.replace('/(tabs)');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Nueva Tarea
          </Text>
          <Text className="text-base text-gray-500">
            Crea una tarea y manténte organizado
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Título
            </Text>
            <TextInput
              className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 ${
                errors.title ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Ej: Completar informe mensual"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setErrors({ ...errors, title: '' });
              }}
            />
            {errors.title ? (
              <Text className="text-xs text-red-500 mt-1.5">{errors.title}</Text>
            ) : null}
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Descripción
            </Text>
            <TextInput
              className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 ${
                errors.description ? 'border-red-400' : 'border-gray-200'
              }`}
              placeholder="Describe los detalles de la tarea..."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                setErrors({ ...errors, description: '' });
              }}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
            />
            {errors.description ? (
              <Text className="text-xs text-red-500 mt-1.5">{errors.description}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            className="w-full bg-gray-900 py-4 rounded-xl"
            onPress={handleCreateTask}
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-base">
              Crear Tarea
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}
