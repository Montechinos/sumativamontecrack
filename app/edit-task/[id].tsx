import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { useTasks } from "@/lib/context/TaskContext";

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask } = useTasks();

  const task = tasks.find((t) => t.id === id);

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [errors, setErrors] = useState({ title: "", description: "" });

  useEffect(() => {
    if (!task) {
      Alert.alert("Error", "La tarea no existe");
      router.back();
    }
  }, []);

  const validateAlphanumeric = (text: string) => /^[a-zA-Z0-9\s]+$/.test(text);

  const handleEditTask = async () => {
    let valid = true;
    const newErrors = { title: "", description: "" };

    if (!title.trim()) {
      newErrors.title = "El título es requerido";
      valid = false;
    } else if (!validateAlphanumeric(title)) {
      newErrors.title = "Solo caracteres alfanuméricos permitidos";
      valid = false;
    }

    if (!description.trim()) {
      newErrors.description = "La descripción es requerida";
      valid = false;
    } else if (!validateAlphanumeric(description)) {
      newErrors.description = "Solo caracteres alfanuméricos permitidos";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) return;

    await updateTask(id!, {
      title: title.trim(),
      description: description.trim(),
    });

    Alert.alert("Éxito", "Tarea actualizada correctamente");
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="px-6 py-8">
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Editar Tarea
          </Text>
          <Text className="text-base text-gray-500">
            Actualiza la información de tu tarea
          </Text>
        </View>

        <View className="bg-white rounded-2xl p-6 shadow-sm">
          {/* TÍTULO */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Título
            </Text>
            <TextInput
              className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 ${
                errors.title ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="Ej: Comprar materiales"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                setErrors({ ...errors, title: "" });
              }}
            />
            {errors.title ? (
              <Text className="text-xs text-red-500 mt-1.5">{errors.title}</Text>
            ) : null}
          </View>

          {/* DESCRIPCIÓN */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Descripción
            </Text>
            <TextInput
              className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl text-gray-900 ${
                errors.description ? "border-red-400" : "border-gray-200"
              }`}
              placeholder="Describe los detalles de la tarea..."
              value={description}
              multiline
              onChangeText={(text) => {
                setDescription(text);
                setErrors({ ...errors, description: "" });
              }}
              style={{ minHeight: 100 }}
              textAlignVertical="top"
            />
            {errors.description ? (
              <Text className="text-xs text-red-500 mt-1.5">
                {errors.description}
              </Text>
            ) : null}
          </View>

          {/* BOTONES */}
          <View className="space-y-3">
            <TouchableOpacity
              className="w-full bg-gray-900 py-4 rounded-xl"
              onPress={handleEditTask}
            >
              <Text className="text-white text-center font-semibold text-base">
                Guardar Cambios
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="w-full bg-gray-100 py-4 rounded-xl"
              onPress={() => router.back()}
            >
              <Text className="text-gray-700 text-center font-medium text-base">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
