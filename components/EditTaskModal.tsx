import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { useTasks } from "../lib/context/TaskContext";

interface Props {
  visible: boolean;
  onClose: () => void;
  task: any | null;
}

export default function EditTaskModal({ visible, onClose, task }: Props) {
  const { updateTask } = useTasks();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  const saveChanges = async () => {
    if (!task) return;

    await updateTask(task.id, {
      title,
      description,
    });

    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50 px-4">
        <View className="bg-white w-full p-5 rounded-xl">

          <Text className="text-xl font-bold mb-3">Editar tarea</Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Título"
            className="border p-2 rounded mb-3"
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Descripción"
            className="border p-2 rounded mb-3"
          />

          <TouchableOpacity
            onPress={saveChanges}
            className="bg-blue-600 p-3 rounded mt-2"
          >
            <Text className="text-white text-center font-semibold">Guardar cambios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="mt-3 p-2"
          >
            <Text className="text-center text-gray-600 font-semibold">Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
