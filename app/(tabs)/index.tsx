import "@/global.css";
import { useAuth } from "@/lib/context/AuthContext";
import { Task, useTasks } from "@/lib/context/TaskContext";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

import ProgressBar from "@/components/tasks/ProgressBar";
import TaskCard from "@/components/tasks/TaskCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ModalWrapper from "@/components/ui/ModalWrapper";

export default function HomeScreen() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { logout } = useAuth();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // LOGOUT REAL → VA A LOGIN
  const handleLogout = () => {
    if(Platform.OS == "web"){
      router.replace("/login");
    }else{
      Alert.alert(
        "Cerrar Sesión",
        "¿Seguro que deseas salir?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Salir",
            style: "destructive",
            onPress: () => {
              logout(); // Limpia sesión
              router.replace("/login"); // ⬅️ navega al login REAL
            },
          },
        ]
      );
    }
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setModalVisible(true);
  };

  const openCreate = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (editingTask) {
      await updateTask(editingTask.id, { title, description });
    } else {
      await addTask({ title, description, completed: false });
    }

    setModalVisible(false);
    setTitle("");
    setDescription("");
    setEditingTask(null);
  };

  const progress =
    tasks.length === 0
      ? 0
      : tasks.filter((t) => t.completed).length / tasks.length;

  return (
    <View className="flex-1 bg-white p-4">

      {/* 🔥 BOTÓN SALIR FUERA DE CABECERA */}
      <TouchableOpacity
        onPress={handleLogout}
        className="self-end mb-4 px-4 py-2 bg-gray-100 rounded-lg"
        activeOpacity={0.7}
      >
        <Text className="text-gray-700 font-semibold">Salir</Text>
      </TouchableOpacity>

      <Text className="text-3xl font-bold mb-2">Tus tareas</Text>

      <ProgressBar progress={progress} />

      <Text className="mt-2 mb-4 text-gray-600">
        {tasks.filter((t) => t.completed).length} completadas de {tasks.length}
      </Text>

      <Button label="Crear tarea" onPress={openCreate} className="mb-4" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">No hay tareas aún</Text>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => updateTask(task.id, { completed: !task.completed })}
              onEdit={() => openEdit(task)}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        )}
      </ScrollView>

      <ModalWrapper visible={modalVisible}>
        <Text className="text-xl font-bold mb-3">
          {editingTask ? "Editar tarea" : "Nueva tarea"}
        </Text>

        <Input
          value={title}
          onChangeText={setTitle}
          placeholder="Título"
          className="mb-3"
        />

        <Input
          value={description}
          onChangeText={setDescription}
          placeholder="Descripción"
          multiline
          className="mb-3"
        />

        <Button
          label={editingTask ? "Guardar cambios" : "Crear tarea"}
          onPress={handleSave}
          variant="primary"
        />

        <Button
          label="Cancelar"
          onPress={() => setModalVisible(false)}
          variant="secondary"
          className="mt-2"
        />
      </ModalWrapper>
    </View>
  );
}
