import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { taskSchema } from '@/lib/schemas/taskSchema';
import { useTasks } from '@/lib/context/TaskContext';
import { router } from 'expo-router';

export default function CreateTaskScreen() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });

  const handleCreateTask = async () => {
    const result = taskSchema.safeParse({
      title,
      description,
    });

    if (!result.success) {
      setErrors(parseZodErrors(result.error.issues));
      return;
    }

    setErrors({ title: '', description: '' });

    await addTask({
      title: title.trim(),
      description: description.trim(),
      completed: false,
    });

    Alert.alert("Éxito", "Tarea creada correctamente");
    router.replace('/(tabs)');
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">

        <Text className="text-3xl font-bold text-gray-900 mb-6">Nueva Tarea</Text>

        <View className="bg-white rounded-2xl p-6 shadow-sm">
          
          <Text className="text-sm font-medium text-gray-700 mb-2">Título</Text>
          <TextInput
            className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl ${
              errors.title ? 'border-red-400' : 'border-gray-200'
            }`}
            value={title}
            onChangeText={(t) => {
              setTitle(t);
              setErrors({ ...errors, title: '' });
            }}
          />
          {errors.title ? <Text className="text-red-500 mt-1">{errors.title}</Text> : null}

          <Text className="text-sm font-medium text-gray-700 mt-6 mb-2">Descripción</Text>
          <TextInput
            className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl ${
              errors.description ? 'border-red-400' : 'border-gray-200'
            }`}
            value={description}
            multiline
            onChangeText={(t) => {
              setDescription(t);
              setErrors({ ...errors, description: '' });
            }}
          />
          {errors.description ? <Text className="text-red-500 mt-1">{errors.description}</Text> : null}

          <TouchableOpacity
            className="bg-black py-4 rounded-xl mt-6"
            onPress={handleCreateTask}
          >
            <Text className="text-white text-center font-semibold">Crear Tarea</Text>
          </TouchableOpacity>

        </View>
      </View>
    </ScrollView>
  );
}

// Helper
const parseZodErrors = (issues: any[]) => {
  const formatted: any = {};
  issues.forEach((issue) => {
    const field = issue.path[0];
    if (field) formatted[field] = issue.message;
  });
  return formatted;
};
