import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getAllTasks,
  createTask,
  updateTaskApi,
  deleteTaskApi,
} from "@/taskApi";

// 1. 🔥 INTERFAZ ACTUALIZADA para incluir 'createdAt'
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string; // <-- AÑADIDO: Propiedad requerida por tu API
}

// 2. TIPO DE ENTRADA: Lo que el componente pasa (sin id ni createdAt)
type TaskInput = Omit<Task, "id" | "createdAt">;

// 3. TIPO PARA CREAR EN API: Lo que la API espera (sin id, pero con createdAt)
type NewTaskData = Omit<Task, "id">; 

interface TaskContextType {
  tasks: Task[];
  getTasks: () => Promise<void>;
  // Recibe solo el TaskInput
  addTask: (data: TaskInput) => Promise<void>; 
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  // ... (getTasks y useEffect permanecen iguales)
  const getTasks = async () => {
    const data = await getAllTasks();
    setTasks(data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  // 4. 🔥 Crear tarea real en JSON server (LÓGICA CORREGIDA)
  const addTask = async (task: TaskInput) => {
    // 5. Construir el objeto NewTaskData añadiendo 'createdAt'
    const taskWithDate: NewTaskData = {
      ...task,
      createdAt: new Date().toISOString(), // Genera la fecha
    };

    // La función createTask ahora recibe el tipo NewTaskData correcto
    const newTask = await createTask(taskWithDate); 
    setTasks((prev) => [...prev, newTask]);
  };

  // ... (updateTask y deleteTask permanecen iguales)
  const updateTask = async (id: string, data: Partial<Task>) => {
    const updated = await updateTaskApi(id, data);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTask = async (id: string) => {
    await deleteTaskApi(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };
  
  return (
    <TaskContext.Provider
      value={{ tasks, getTasks, addTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks debe usarse dentro de TaskProvider");
  return ctx;
}