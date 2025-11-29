import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAI } from '@/lib/context/AIContext';
import { Task } from '@/lib/context/TaskContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  task: Task;
  onCreateSubtask?: (subtask: string) => void;
}

type TabType = 'suggestions' | 'subtasks';

export default function AIAssistantModal({ visible, onClose, task, onCreateSubtask }: Props) {
  const { generateTaskSuggestions, generateSubtasks, isLoading } = useAI();

  const [activeTab, setActiveTab] = useState<TabType>('suggestions');
  const [suggestions, setSuggestions] = useState<string>('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

  // Cargar datos al abrir modal
  const loadData = async () => {
    if (hasFetched) return;

    setHasFetched(true);

    try {
      if (activeTab === 'suggestions') {
        const result = await generateTaskSuggestions(task.title, task.description);
        setSuggestions(result);
      } else {
        const result = await generateSubtasks(task.title, task.description);
        setSubtasks(result);
      }
    } catch (error) {
      console.error('Error al cargar datos de IA:', error);
    }
  };

  // Resetear al cambiar de tab
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setHasFetched(false);
    setSuggestions('');
    setSubtasks([]);
  };

  // Cerrar y resetear
  const handleClose = () => {
    setHasFetched(false);
    setSuggestions('');
    setSubtasks([]);
    setActiveTab('suggestions');
    onClose();
  };

  // Auto-cargar cuando se abre el modal
  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible, activeTab]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold"> Asistente IA</Text>
            <TouchableOpacity onPress={handleClose}>
              <Text className="text-gray-500 text-xl font-bold">✕</Text>
            </TouchableOpacity>
          </View>

          {/* Task Info */}
          <View className="bg-blue-50 p-4 rounded-xl mb-4">
            <Text className="font-bold text-lg">{task.title}</Text>
            <Text className="text-gray-600 mt-1">{task.description}</Text>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-2 mb-4">
            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${
                activeTab === 'suggestions' ? 'bg-black' : 'bg-gray-200'
              }`}
              onPress={() => handleTabChange('suggestions')}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === 'suggestions' ? 'text-white' : 'text-gray-700'
                }`}
              >
                 Sugerencias
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className={`flex-1 py-3 rounded-xl ${
                activeTab === 'subtasks' ? 'bg-black' : 'bg-gray-200'
              }`}
              onPress={() => handleTabChange('subtasks')}
            >
              <Text
                className={`text-center font-semibold ${
                  activeTab === 'subtasks' ? 'text-white' : 'text-gray-700'
                }`}
              >
                 Subtareas
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color="#000" />
                <Text className="text-gray-500 mt-3">Generando...</Text>
              </View>
            ) : activeTab === 'suggestions' ? (
              <View className="bg-gray-50 p-4 rounded-xl">
                <Text className="text-gray-800 leading-6">
                  {suggestions || 'No hay sugerencias disponibles.'}
                </Text>
              </View>
            ) : (
              <View>
                {subtasks.length === 0 ? (
                  <Text className="text-center text-gray-500 py-4">
                    No se generaron subtareas.
                  </Text>
                ) : (
                  subtasks.map((subtask, index) => (
                    <View
                      key={index}
                      className="bg-green-50 p-4 rounded-xl mb-2 flex-row items-center justify-between"
                    >
                      <Text className="flex-1 text-gray-800">{subtask}</Text>
                      {onCreateSubtask && (
                        <TouchableOpacity
                          onPress={() => {
                            onCreateSubtask(subtask);
                            handleClose();
                          }}
                          className="ml-2 bg-green-500 px-3 py-2 rounded-lg"
                        >
                          <Text className="text-white text-xs font-bold">+ Crear</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ))
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}