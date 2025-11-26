import axios from "axios";

const API = axios.create({
  baseURL: "https://3000-firebase-sumativamontecrack-1764015105321.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev/"
});

// Obtener tareas
export const getTasksApi = async () => {
  const res = await API.get("/tasks");
  return res.data;
};

// Crear tarea
export const addTaskApi = async (task: {
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}) => {
  const res = await API.post("/tasks", task);
  return res.data;
};

// Actualizar tarea
export const updateTaskApi = async (id: string, data: any) => {
  const res = await API.patch(`/tasks/${id}`, data);
  return res.data;
};

// Eliminar tarea
export const deleteTaskApi = async (id: string) => {
  await API.delete(`/tasks/${id}`);
  return true;
};
