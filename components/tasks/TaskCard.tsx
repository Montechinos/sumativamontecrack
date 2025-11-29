import { View, Text, TouchableOpacity } from "react-native";
import { Task } from "@/lib/context/TaskContext";
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

  return (
    <>
      <View className="bg-blue-100 p-4 rounded-xl mb-3">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1">
            <Text className="text-xl font-bold">{task.title}</Text>
            <Text className="text-gray-700 mt-1">{task.description}</Text>
          </View>

          {/* Botón de ayuda IA */}
          <TouchableOpacity
            onPress={() => setShowAIModal(true)}
            className="bg-purple-500 w-10 h-10 rounded-full items-center justify-center ml-2"
          >
            <Text className="text-white text-xl">🤖</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-2 mt-3">
          <TouchableOpacity
            onPress={onToggle}
            className={`flex-1 py-3 rounded-lg ${
              task.completed ? 'bg-green-500' : 'bg-gray-400'
            }`}
          >
            <Text className="text-white text-center font-semibold">
              {task.completed ? "✓ Completado" : "⏳ Pendiente"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onEdit}
            className="flex-1 bg-blue-500 py-3 rounded-lg"
          >
            <Text className="text-white text-center font-semibold">Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDelete}
            className="flex-1 bg-red-500 py-3 rounded-lg"
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