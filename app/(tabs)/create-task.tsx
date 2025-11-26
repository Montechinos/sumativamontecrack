import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';

interface Task {
  id: string;
  title: string;
  description: string;
}

export default function CreateTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });

  const validateAlphanumeric = (text: string) => {
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    return alphanumericRegex.test(text);
  };

  const handleCreateTask = () => {
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

    if (valid) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim()
      };
      
      console.log('Tarea creada:', newTask);
      Alert.alert('Éxito', 'Tarea creada correctamente');
      
      // Limpiar formulario
      setTitle('');
      setDescription('');
      
      // Aquí guardarías en el Context/Redux y llamarías a la API
    }
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

          <View className="space-y-3">
            <TouchableOpacity
              className="w-full bg-gray-900 py-4 rounded-xl"
              onPress={handleCreateTask}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold text-base">
                Crear Tarea
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-gray-100 py-4 rounded-xl"
              onPress={() => {
                setTitle('');
                setDescription('');
                setErrors({ title: '', description: '' });
              }}
              activeOpacity={0.8}
            >
              <Text className="text-gray-700 text-center font-medium text-base">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 p-4 bg-blue-50 rounded-xl">
          <Text className="text-xs text-blue-800 font-medium mb-1">
            💡 Recordatorio
          </Text>
          <Text className="text-xs text-blue-700">
            Solo se permiten caracteres alfanuméricos en título y descripción
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}