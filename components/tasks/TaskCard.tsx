import { View, Text } from "react-native";
import Button from "../ui/Button";
import { Task } from "@/lib/context/TaskContext";

interface Props {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  return (
    <View className="bg-blue-100 p-4 rounded-xl mb-3">
      <Text className="text-xl font-bold">{task.title}</Text>
      <Text className="text-gray-700 mt-1">{task.description}</Text>

      <View className="flex-row gap-2 mt-3">

        <Button
          label={task.completed ? "Completado" : "En progreso"}
          onPress={onToggle}
          variant={task.completed ? "primary" : "secondary"}
          className="flex-1"
        />

        <Button
          label="Editar"
          onPress={onEdit}
          variant="primary"
          className="flex-1"
        />

        <Button
          label="Eliminar"
          onPress={onDelete}
          variant="danger"
          className="flex-1"
        />
      </View>
    </View>
  );
}
