import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getAllTasks,
  createTask,
  updateTaskApi,
  deleteTaskApi,
  Task as ApiTask,
} from "@/taskApi";

export interface Task extends ApiTask {}

type TaskInput = {
  title: string;
  description: string;
  completed: boolean;
};

interface TaskContextType {
  tasks: Task[];
  getTasks: () => Promise<void>;
  addTask: (data: TaskInput) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const getTasks = async () => {
    const data = await getAllTasks();
    setTasks(data);
  };

  useEffect(() => {
    getTasks();
  }, []);

  const addTask = async (data: TaskInput) => {
    const newTask = await createTask({
      ...data,
      createdAt: new Date().toISOString(),
    });

    setTasks((prev) => [...prev, newTask]);
  };

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
