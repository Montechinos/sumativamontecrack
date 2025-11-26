import axios from "axios";

// ================================
// INTERFAZ DE TAREA
// ================================
// Define la estructura de la tarea completa, tal como viene del servidor
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; 
}

// Tipo de dato para crear una tarea (sin 'id')
// Se asume que tu API requiere createdAt
type NewTaskData = Omit<Task, "id">; 

const API = axios.create({
  baseURL: "https://3000-firebase-sumativamontecrack-1764015105321.cluster-lr6dwlc2lzbcctqhqorax5zmro.cloudworkstations.dev" // <-- tu json-server local
});

// ================================
// GET: Obtener todas las tareas
// ================================
// Retorna un Array de tareas
export const getAllTasks = async (): Promise<Task[]> => {
  const res = await API.get("/tasks");
  return res.data;
};

// ================================
// POST: Crear tarea
// ================================
// Recibe un objeto sin 'id' y devuelve la tarea completa con 'id'
export const createTask = async (task: NewTaskData): Promise<Task> => {
  const res = await API.post("/tasks", task);
  return res.data;
};

// ================================
// PATCH: Actualizar tarea
// ================================
// Recibe un objeto parcial (solo lo que se va a cambiar)
export const updateTaskApi = async (id: string, data: Partial<Task>): Promise<Task> => {
  const res = await API.patch(`/tasks/${id}`, data);
  return res.data;
};

// ================================
// DELETE: Eliminar tarea
// ================================
export const deleteTaskApi = async (id: string): Promise<void> => {
  // axios.delete devuelve la data de la respuesta, pero para DELETE no suele ser relevante.
  // Tipamos el retorno como 'void' ya que no esperamos un objeto Task
  await API.delete(`/tasks/${id}`);
};