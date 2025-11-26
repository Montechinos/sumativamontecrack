import React, { createContext, useContext, useState } from "react";

// 👉 AHORA exportamos Task para poder usarlo en otras pantallas
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export interface TaskContextType {
  tasks: Task[];
  getTasks: () => Promise<void>;
  addTask: (task: Omit<Task, "id" | "createdAt">) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  clearTasks: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = async () => {
    return;
  };

  const addTask = async (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...data } : t))
    );
  };

  const deleteTask = async (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const clearTasks = () => setTasks([]);

  return (
    <TaskContext.Provider
      value={{ tasks, getTasks, addTask, updateTask, deleteTask, clearTasks }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function  useTasks() {
  const context = useContext(TaskContext);
  if (!context)
    throw new Error("useTasks debe usarse dentro de un TaskProvider");
  return context;
}
