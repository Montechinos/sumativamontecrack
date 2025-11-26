import "@/global.css";
import { View, Text, ScrollView } from "react-native";
import { useState } from "react";
import { useTasks, Task } from "@/lib/context/TaskContext";

import TaskCard from "@/components/tasks/TaskCard";
import ProgressBar from "@/components/tasks/ProgressBar";
import ModalWrapper from "@/components/ui/ModalWrapper";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function HomeScreen() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();

  // Estados para modal de crear/editar
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Inputs del formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Abrir modal para EDITAR
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setModalVisible(true);
  };

  // Abrir modal para CREAR
  const openCreate = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setModalVisible(true);
  };

  // Guardar cambios o crear tarea
  const handleSave = async () => {
    if (editingTask) {
      await updateTask(editingTask.id, {
        title,
        description,
      });
    } else {
      await addTask({
        title,
        description,
        completed: false,
      });
    }

    setModalVisible(false);
    setTitle("");
    setDescription("");
    setEditingTask(null);
  };

  // Cálculo de progreso
  const progress =
    tasks.length === 0
      ? 0
      : tasks.filter((t) => t.completed).length / tasks.length;

  return (
    <View className="flex-1 bg-white p-4">

      {/* HEADER */}
      <Text className="text-3xl font-bold mb-2">Tus tareas</Text>

      {/* PROGRESO */}
      <ProgressBar progress={progress} />

      <Text className="mt-2 mb-4 text-gray-600">
        {tasks.filter((t) => t.completed).length} completadas de {tasks.length}
      </Text>

      {/* BOTÓN CREAR */}
      <Button label="Crear tarea" onPress={openCreate} className="mb-4" />

      {/* LISTA DE TAREAS */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">
            No hay tareas aún
          </Text>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() =>
                updateTask(task.id, { completed: !task.completed })
              }
              onEdit={() => openEdit(task)}
              onDelete={() => deleteTask(task.id)}
            />
          ))
        )}
      </ScrollView>

      {/* MODAL CREAR/EDITAR */}
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
