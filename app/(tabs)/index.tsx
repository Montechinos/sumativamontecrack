import "@/global.css";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useTasks } from "../../lib/context/TaskContext";
import EditTaskModal from "../../components/EditTaskModal";

export default function TaskScreen() {
  const { tasks, deleteTask, updateTask } = useTasks();

  const [editingTask, setEditingTask] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length === 0 ? 0 : (completedCount / tasks.length) * 100;

  return (
    <View className="flex-1 bg-white p-4">

      {/* Progreso */}
      <Text className="text-xl font-bold mb-2">Progreso</Text>
      <Text className="text-gray-600 mb-4">{completedCount} completadas de {tasks.length}</Text>

      <View className="w-full h-3 bg-gray-200 rounded-full mb-5">
        <View
          style={{ width: `${progress}%` }}
          className="h-full bg-green-500 rounded-full"
        />
      </View>

      <ScrollView className="flex-1">

        {tasks.map((task) => (
          <View
            key={task.id}
            className="bg-gray-100 p-4 rounded-xl mb-4"
          >
            <Text className="text-lg font-bold">{task.title}</Text>
            <Text className="text-gray-700 mb-3">{task.description}</Text>

            <View className="flex-row gap-3">

              {/* Botón completar */}
              <TouchableOpacity
                onPress={() => updateTask(task.id, { completed: !task.completed })}
                className={`px-3 py-2 rounded ${task.completed ? "bg-green-600" : "bg-blue-600"}`}
              >
                <Text className="text-white font-semibold">
                  {task.completed ? "Completada" : "Completar"}
                </Text>
              </TouchableOpacity>

              {/* Botón editar */}
              <TouchableOpacity
                onPress={() => {
                  setEditingTask(task);
                  setModalVisible(true);
                }}
                className="px-3 py-2 rounded bg-yellow-500"
              >
                <Text className="text-white font-semibold">Editar</Text>
              </TouchableOpacity>

              {/* Botón eliminar */}
              <TouchableOpacity
                onPress={() => deleteTask(task.id)}
                className="px-3 py-2 rounded bg-red-600"
              >
                <Text className="text-white font-semibold">Eliminar</Text>
              </TouchableOpacity>

            </View>
          </View>
        ))}

      </ScrollView>

      {/* Modal de edición */}
      <EditTaskModal
        visible={modalVisible}
        task={editingTask}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
