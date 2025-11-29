import { View, Text, TouchableOpacity } from "react-native";
import { Task } from "@/lib/context/TaskContext";
import { useTheme } from "@/lib/context/ThemeContext";
import { useState } from "react";
import AIAssistantModal from "../ai/AIAssistantModal";

interface Props {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCreateSubtask?: (subtask: string) => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete, onCreateSubtask }: Props) {
  const [showAIModal, setShowAIModal] = useState(false);
  const { currentTheme } = useTheme();

  return (
    <>
      <View
        style={{
          backgroundColor: currentTheme.colors.card,
          borderColor: currentTheme.colors.border,
        }}
        className="p-4 rounded-xl mb-3 border"
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text style={{ color: currentTheme.colors.text }} className="text-xl font-bold">
              {task.title}
            </Text>
            <Text style={{ color: currentTheme.colors.textSecondary }} className="mt-1">
              {task.description}
            </Text>
          </View>

          {/* Botón de ayuda IA */}
          <TouchableOpacity
            onPress={() => setShowAIModal(true)}
            style={{ backgroundColor: currentTheme.colors.ai }}
            className="w-10 h-10 rounded-full items-center justify-center ml-2"
          >
            <Text style={{ color: currentTheme.colors.aiText }} className="text-xl">
              IA
            </Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2 mt-3">
          <TouchableOpacity
            onPress={onToggle}
            style={{
              backgroundColor: task.completed
                ? currentTheme.colors.success
                : currentTheme.colors.secondary,
            }}
            className="flex-1 py-3 rounded-lg"
          >
            <Text style={{ color: currentTheme.colors.primaryText }} className="text-center font-semibold">
              {task.completed ? "✓ Completado" : "Pendiente"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onEdit}
            style={{ backgroundColor: currentTheme.colors.primary }}
            className="flex-1 py-3 rounded-lg"
          >
            <Text style={{ color: currentTheme.colors.primaryText }} className="text-center font-semibold">
              Editar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            style={{ backgroundColor: currentTheme.colors.danger }}
            className="flex-1 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de asistente IA */}
      <AIAssistantModal
        visible={showAIModal}
        onClose={() => setShowAIModal(false)}
        task={task}
        onCreateSubtask={onCreateSubtask}
      />
    </>
  );
}