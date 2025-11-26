import "@/global.css";
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Link, router } from 'expo-router';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
}

export default function TaskListScreen() {
  // Datos de ejemplo (después se reemplazará con Context API)
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Completar proyecto de React Native',
      description: 'Desarrollar la aplicación de gestión de tareas con todas las funcionalidades requeridas',
      completed: false,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Estudiar para el examen',
      description: 'Repasar los temas de programación móvil y APIs',
      completed: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Hacer commit en Git',
      description: 'Subir los cambios al repositorio con un mensaje descriptivo',
      completed: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const handleDeleteTask = (id: string) => {
    Alert.alert(
      'Eliminar Tarea',
      '¿Estás seguro de que deseas eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            setTasks(tasks.filter(task => task.id !== id));
            // Aquí llamarías a la API DELETE
          }
        }
      ]
    );
  };

  const handleToggleComplete = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    // Aquí llamarías a la API PUT para actualizar
  };

  const handleEditTask = (task: Task) => {
    // Navegar a pantalla de edición pasando el ID
    router.push(`/edit-task/${task.id}`);
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-3xl font-bold text-gray-900">
              Mis Tareas
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {completedTasks} de {totalTasks} completadas
            </Text>
          </View>
          
          <TouchableOpacity
            className="bg-gray-900 px-4 py-2 rounded-lg"
            onPress={() => router.push('/(tabs)/create-task')}
            activeOpacity={0.8}
          >
            <Text className="text-white font-semibold">+ Nueva</Text>
          </TouchableOpacity>
        </View>

        {/* Barra de progreso */}
        <View className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <View 
            className="bg-gray-900 h-full rounded-full"
            style={{ width: `${totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0}%` }}
          />
        </View>
      </View>

      {/* Lista de tareas */}
      <ScrollView className="flex-1 px-6 py-4">
        {tasks.length === 0 ? (
          <View className="items-center justify-center mt-20">
            <Text className="text-6xl mb-4">📝</Text>
            <Text className="text-xl font-semibold text-gray-900 mb-2">
              No hay tareas
            </Text>
            <Text className="text-gray-500 text-center mb-6">
              Crea tu primera tarea para comenzar
            </Text>
            <TouchableOpacity
              className="bg-gray-900 px-6 py-3 rounded-xl"
              onPress={() => router.push('/(tabs)/create-task')}
            >
              <Text className="text-white font-semibold">Crear Tarea</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-3">
            {tasks.map((task) => (
              <View
                key={task.id}
                className={`bg-white rounded-2xl p-4 shadow-sm border ${
                  task.completed ? 'border-gray-200 opacity-60' : 'border-gray-100'
                }`}
              >
                <View className="flex-row items-start">
                  {/* Checkbox */}
                  <TouchableOpacity
                    onPress={() => handleToggleComplete(task.id)}
                    className="mr-3 mt-1"
                    activeOpacity={0.7}
                  >
                    <View className={`w-6 h-6 rounded-lg border-2 items-center justify-center ${
                      task.completed ? 'bg-gray-900 border-gray-900' : 'border-gray-300'
                    }`}>
                      {task.completed && (
                        <Text className="text-white text-xs font-bold">✓</Text>
                      )}
                    </View>
                  </TouchableOpacity>

                  {/* Contenido de la tarea */}
                  <View className="flex-1">
                    <Text className={`text-base font-semibold mb-1 ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}>
                      {task.title}
                    </Text>
                    <Text className={`text-sm ${
                      task.completed ? 'text-gray-400' : 'text-gray-600'
                    }`} numberOfLines={2}>
                      {task.description}
                    </Text>

                    {/* Botones de acción */}
                    <View className="flex-row mt-3 space-x-2">
                      <TouchableOpacity
                        onPress={() => handleEditTask(task)}
                        className="bg-gray-100 px-4 py-2 rounded-lg"
                        activeOpacity={0.7}
                      >
                        <Text className="text-gray-700 text-xs font-medium">
                          ✏️ Editar
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteTask(task.id)}
                        className="bg-red-50 px-4 py-2 rounded-lg"
                        activeOpacity={0.7}
                      >
                        <Text className="text-red-600 text-xs font-medium">
                          🗑️ Eliminar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer con estadísticas */}
      {tasks.length > 0 && (
        <View className="bg-white px-6 py-4 border-t border-gray-100">
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl font-bold text-gray-900">{totalTasks}</Text>
              <Text className="text-xs text-gray-500">Total</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-green-600">{completedTasks}</Text>
              <Text className="text-xs text-gray-500">Completadas</Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl font-bold text-orange-600">
                {totalTasks - completedTasks}
              </Text>
              <Text className="text-xs text-gray-500">Pendientes</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}