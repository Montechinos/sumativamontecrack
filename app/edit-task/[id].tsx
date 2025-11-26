import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });

  // Simular carga de datos (después vendrá del Context/API)
  useEffect(() => {
    // Aquí cargarías la tarea desde el Context o API
    // Por ahora usamos datos de ejemplo
    const mockTask = {
      id: id as string,
      title: 'Completar proyecto de React Native',
      description: 'Desarrollar la aplicación de gestión de tareas',
      completed: false
    };
    
    setTitle(mockTask.title);
    setDescription(mockTask.description);
  }, [id]);

  const validateAlphanumeric = (text: string) => {
    const alphanumericRegex = /^[a-zA-Z0-9\s]+$/;
    return alphanumericRegex.test(text);
  };

  const handleUpdateTask = () => {
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
      const updatedTask: Task = {
        id: id as string,
        title: title.trim(),
        description: description.trim(),
        completed: false
      };
      
      console.log('Tarea actualizada:', updatedTask);
      Alert.alert('Éxito', 'Tarea actualizada correctamente', [
        { text: 'OK', onPress: () => router.back() }
      ]);
      
      // Aquí actualizarías en el Context/Redux y llamarías a la API PUT
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="mr-4"
            activeOpacity={0.7}
          >
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Editar Tarea
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              ID: {id}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 px-6 py-6">
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
              onPress={handleUpdateTask}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center font-semibold text-base">
                Guardar Cambios
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-gray-100 py-4 rounded-xl"
              onPress={() => router.back()}
              activeOpacity={0.8}
            >
              <Text className="text-gray-700 text-center font-medium text-base">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 p-4 bg-amber-50 rounded-xl">
          <Text className="text-xs text-amber-800 font-medium mb-1">
            ⚠️ Importante
          </Text>
          <Text className="text-xs text-amber-700">
            Los cambios se guardarán en la base de datos. Asegúrate de revisar bien antes de guardar.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}