import "@/global.css";
import { useAuth } from "@/lib/context/AuthContext";
import { Task, useTasks } from "@/lib/context/TaskContext";
import { useTheme } from "@/lib/context/ThemeContext";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";

import ProgressBar from "@/components/tasks/ProgressBar";
import TaskCard from "@/components/tasks/TaskCard";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ModalWrapper from "@/components/ui/ModalWrapper";
import SmartTaskCreator from "@/components/ai/SmartTaskCreator";
import ThemeSelector from "@/components/theme/ThemeSelector";
import { useAI } from "@/lib/context/AIContext";

export default function HomeScreen() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const { logout } = useAuth();
  const { analyzeTaskPriority, isLoading: aiLoading } = useAI();
  const { currentTheme } = useTheme();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showAICreator, setShowAICreator] = useState(false);
  const [priorityAnalysis, setPriorityAnalysis] = useState<string | null>(null);

  const handleLogout = () => {
    if (Platform.OS === "web") {
      router.replace("/login");
    } else {
      Alert.alert("Cerrar Sesión", "¿Seguro que deseas salir?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/login");
          },
        },
      ]);
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

  const handleAnalyzePriority = async () => {
    if (tasks.length === 0) {
      Alert.alert("Sin tareas", "No hay tareas para analizar");
      return;
    }

    try {
      const analysis = await analyzeTaskPriority(tasks);
      setPriorityAnalysis(analysis);
    } catch (error) {
      console.error('Error al analizar prioridades:', error);
      Alert.alert('Error', 'No se pudo analizar. Verifica tu API Key.');
    }
  };

  const handleCreateSubtask = async (subtaskText: string) => {
    try {
      await addTask({
        title: subtaskText.slice(0, 50),
        description: subtaskText,
        completed: false,
      });

      Alert.alert("Subtarea creada");
    } catch (error) {
      console.error('Error al crear subtarea:', error);
    }
  };

  const progress =
    tasks.length === 0 ? 0 : tasks.filter((t) => t.completed).length / tasks.length;

  return (
    <View style={{ backgroundColor: currentTheme.colors.background }} className="flex-1 p-4">
      {/* Header con botones */}
      <View className="flex-row justify-between mb-4">
        <ThemeSelector />
        
        <TouchableOpacity
          onPress={handleLogout}
          style={{ backgroundColor: currentTheme.colors.surface }}
          className="px-4 py-2 rounded-lg"
          activeOpacity={0.7}
        >
          <Text style={{ color: currentTheme.colors.text }} className="font-semibold">
            Salir
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: currentTheme.colors.text }} className="text-3xl font-bold mb-2">
        Tus tareas
      </Text>

      <ProgressBar progress={progress} />

      <Text style={{ color: currentTheme.colors.textSecondary }} className="mt-2 mb-4">
        {tasks.filter((t) => t.completed).length} completadas de {tasks.length}
      </Text>

      {/* Botones de acción */}
      <View className="flex-row gap-2 mb-4">
        <TouchableOpacity
          onPress={openCreate}
          style={{ backgroundColor: currentTheme.colors.primary }}
          className="flex-1 py-3 rounded-xl"
        >
          <Text style={{ color: currentTheme.colors.primaryText }} className="text-center font-bold">
            Crear Manual
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowAICreator(!showAICreator)}
          style={{ backgroundColor: currentTheme.colors.ai }}
          className="flex-1 py-3 rounded-xl"
        >
          <Text style={{ color: currentTheme.colors.aiText }} className="text-center font-bold">
            {showAICreator ? "✕ Cerrar IA" : "Crear con IA"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Smart Task Creator */}
      {showAICreator && (
        <View className="mb-4">
          <SmartTaskCreator onSuccess={() => setShowAICreator(false)} />
        </View>
      )}

      {/* Análisis de prioridades */}
      {tasks.length > 0 && (
        <TouchableOpacity
          onPress={handleAnalyzePriority}
          style={{ backgroundColor: currentTheme.colors.warning + '20' }}
          className="p-3 rounded-xl mb-4"
          disabled={aiLoading}
        >
          <Text style={{ color: currentTheme.colors.warning }} className="font-semibold text-center">
            {aiLoading ? "Analizando..." : "Analizar Prioridades con IA"}
          </Text>
        </TouchableOpacity>
      )}

      {priorityAnalysis && (
        <View
          style={{
            backgroundColor: currentTheme.colors.warning + '20',
            borderColor: currentTheme.colors.warning,
          }}
          className="p-4 rounded-xl mb-4 border"
        >
          <Text style={{ color: currentTheme.colors.text }} className="font-bold mb-2">
            Análisis de IA:
          </Text>
          <Text style={{ color: currentTheme.colors.textSecondary }}>{priorityAnalysis}</Text>
          <TouchableOpacity onPress={() => setPriorityAnalysis(null)} className="mt-2">
            <Text style={{ color: currentTheme.colors.textSecondary }} className="text-xs">
              ✕ Cerrar
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {tasks.length === 0 ? (
          <Text style={{ color: currentTheme.colors.textSecondary }} className="text-center mt-10">
            No hay tareas aún
          </Text>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => updateTask(task.id, { completed: !task.completed })}
              onEdit={() => openEdit(task)}
              onDelete={() => deleteTask(task.id)}
              onCreateSubtask={handleCreateSubtask}
            />
          ))
        )}
      </ScrollView>

      <ModalWrapper visible={modalVisible}>
        <Text style={{ color: currentTheme.colors.text }} className="text-xl font-bold mb-3">
          {editingTask ? "Editar tarea" : "Nueva tarea"}
        </Text>

        <Input value={title} onChangeText={setTitle} placeholder="Título" className="mb-3" />

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