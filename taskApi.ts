import axios from "axios";

// ================================
// INTERFAZ DE TAREA
// ================================
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; 
}

// Tipo para crear tareas (sin id)
type NewTaskData = Omit<Task, "id">;

// ================================
// CONFIG AXIOS
// ================================
const API = axios.create({
  baseURL:
    "https://3000-firebase-sumativamontecrack-1764015105321.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev",
});

// ================================
// GET: Obtener todas las tareas
// ================================
export const getAllTasks = async (): Promise<Task[]> => {
  const res = await API.get("/tasks");
  return res.data;
};

// ================================
// POST: Crear tarea
// ================================
export const createTask = async (task: NewTaskData): Promise<Task> => {
  // Si por algún motivo no viene createdAt, lo generamos
  if (!task.createdAt) {
    task.createdAt = new Date().toISOString();
  }

  const res = await API.post("/tasks", task);
  return res.data;
};

// ================================
// PATCH: Actualizar tarea
// ================================
export const updateTaskApi = async (
  id: string,
  data: Partial<Task>
): Promise<Task> => {
  const res = await API.patch(`/tasks/${id}`, data);
  return res.data;
};

// ================================
// DELETE: Eliminar tarea
// ================================
export const deleteTaskApi = async (id: string): Promise<void> => {
  await API.delete(`/tasks/${id}`);
};
