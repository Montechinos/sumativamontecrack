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
import { useTheme } from '@/lib/context/ThemeContext';
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
  const { currentTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<TabType>('suggestions');
  const [suggestions, setSuggestions] = useState<string>('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [hasFetched, setHasFetched] = useState(false);

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

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setHasFetched(false);
    setSuggestions('');
    setSubtasks([]);
  };

  const handleClose = () => {
    setHasFetched(false);
    setSuggestions('');
    setSubtasks([]);
    setActiveTab('suggestions');
    onClose();
  };

  useEffect(() => {
    if (visible) {
      loadData();
    }
  }, [visible, activeTab]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View
          style={{ backgroundColor: currentTheme.colors.background }}
          className="rounded-t-3xl p-6 max-h-[80%]"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text style={{ color: currentTheme.colors.text }} className="text-2xl font-bold">
              Asistente IA
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Text style={{ color: currentTheme.colors.textSecondary }} className="text-xl font-bold">
                ✕
              </Text>
            </TouchableOpacity>
          </View>

          {/* Task Info */}
          <View
            style={{
              backgroundColor: currentTheme.colors.card,
              borderColor: currentTheme.colors.border,
            }}
            className="p-4 rounded-xl mb-4 border"
          >
            <Text style={{ color: currentTheme.colors.text }} className="font-bold text-lg">
              {task.title}
            </Text>
            <Text style={{ color: currentTheme.colors.textSecondary }} className="mt-1">
              {task.description}
            </Text>
          </View>

          {/* Tabs */}
          <View className="flex-row gap-2 mb-4">
            <TouchableOpacity
              style={{
                backgroundColor:
                  activeTab === 'suggestions'
                    ? currentTheme.colors.primary
                    : currentTheme.colors.secondary,
              }}
              className="flex-1 py-3 rounded-xl"
              onPress={() => handleTabChange('suggestions')}
            >
              <Text
                style={{
                  color:
                    activeTab === 'suggestions'
                      ? currentTheme.colors.primaryText
                      : currentTheme.colors.text,
                }}
                className="text-center font-semibold"
              >
                Sugerencias
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor:
                  activeTab === 'subtasks'
                    ? currentTheme.colors.primary
                    : currentTheme.colors.secondary,
              }}
              className="flex-1 py-3 rounded-xl"
              onPress={() => handleTabChange('subtasks')}
            >
              <Text
                style={{
                  color:
                    activeTab === 'subtasks'
                      ? currentTheme.colors.primaryText
                      : currentTheme.colors.text,
                }}
                className="text-center font-semibold"
              >
                Subtareas
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {isLoading ? (
              <View className="items-center justify-center py-10">
                <ActivityIndicator size="large" color={currentTheme.colors.primary} />
                <Text style={{ color: currentTheme.colors.textSecondary }} className="mt-3">
                  Generando...
                </Text>
              </View>
            ) : activeTab === 'suggestions' ? (
              <View
                style={{ backgroundColor: currentTheme.colors.surface }}
                className="p-4 rounded-xl"
              >
                <Text style={{ color: currentTheme.colors.text }} className="leading-6">
                  {suggestions || 'No hay sugerencias disponibles.'}
                </Text>
              </View>
            ) : (
              <View>
                {subtasks.length === 0 ? (
                  <Text
                    style={{ color: currentTheme.colors.textSecondary }}
                    className="text-center py-4"
                  >
                    No se generaron subtareas.
                  </Text>
                ) : (
                  subtasks.map((subtask, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: currentTheme.colors.success + '20',
                        borderColor: currentTheme.colors.success,
                      }}
                      className="p-4 rounded-xl mb-2 flex-row items-center justify-between border"
                    >
                      <Text style={{ color: currentTheme.colors.text }} className="flex-1">
                        {subtask}
                      </Text>
                      {onCreateSubtask && (
                        <TouchableOpacity
                          onPress={() => {
                            onCreateSubtask(subtask);
                            handleClose();
                          }}
                          style={{ backgroundColor: currentTheme.colors.success }}
                          className="ml-2 px-3 py-2 rounded-lg"
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