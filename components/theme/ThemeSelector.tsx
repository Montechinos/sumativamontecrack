import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { useTheme, ThemeType } from '@/lib/context/ThemeContext';

export default function ThemeSelector() {
  const { theme, currentTheme, setTheme, themes } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const themeOptions: ThemeType[] = ['normal', 'dark', 'christmas', 'halloween', 'cute'];

  const handleSelectTheme = async (selectedTheme: ThemeType) => {
    await setTheme(selectedTheme);
    setModalVisible(false);
  };

  return (
    <>
      {/* Botón para abrir selector */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={{ backgroundColor: currentTheme.colors.surface }}
        className="px-4 py-2 rounded-lg"
        activeOpacity={0.7}
      >
        <Text style={{ color: currentTheme.colors.text }} className="font-semibold">
          {themes[theme].icon} Tema
        </Text>
      </TouchableOpacity>

      {/* Modal de selección */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <View
            style={{ backgroundColor: currentTheme.colors.background }}
            className="rounded-t-3xl p-6"
          >
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ color: currentTheme.colors.text }} className="text-2xl font-bold">
                Selecciona un Tema
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: currentTheme.colors.textSecondary }} className="text-xl font-bold">
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* Lista de temas */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {themeOptions.map((themeKey) => {
                const themeData = themes[themeKey];
                const isSelected = theme === themeKey;

                return (
                  <TouchableOpacity
                    key={themeKey}
                    onPress={() => handleSelectTheme(themeKey)}
                    style={{
                      backgroundColor: isSelected
                        ? themeData.colors.primary
                        : themeData.colors.surface,
                      borderColor: themeData.colors.border,
                    }}
                    className="p-4 rounded-xl mb-3 border-2"
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Text className="text-4xl mr-3">{themeData.icon}</Text>
                        <View>
                          <Text
                            style={{
                              color: isSelected
                                ? themeData.colors.primaryText
                                : themeData.colors.text,
                            }}
                            className="text-lg font-bold"
                          >
                            {themeData.name}
                          </Text>
                          <Text
                            style={{
                              color: isSelected
                                ? themeData.colors.primaryText
                                : themeData.colors.textSecondary,
                            }}
                            className="text-sm"
                          >
                            {themeKey === 'normal' && 'Clásico y limpio'}
                            {themeKey === 'dark' && 'Perfecto para la noche'}
                            {themeKey === 'christmas' && 'Espíritu navideño '}
                            {themeKey === 'halloween' && 'Oscuro y misterioso '}
                            {themeKey === 'cute' && 'Dulce y colorido '}
                          </Text>
                        </View>
                      </View>

                      {isSelected && (
                        <Text
                          style={{ color: themeData.colors.primaryText }}
                          className="text-2xl"
                        >
                          ✓
                        </Text>
                      )}
                    </View>

                    {/* Preview de colores */}
                    <View className="flex-row gap-2 mt-3">
                      <View
                        style={{ backgroundColor: themeData.colors.primary }}
                        className="w-8 h-8 rounded-lg"
                      />
                      <View
                        style={{ backgroundColor: themeData.colors.secondary }}
                        className="w-8 h-8 rounded-lg"
                      />
                      <View
                        style={{ backgroundColor: themeData.colors.success }}
                        className="w-8 h-8 rounded-lg"
                      />
                      <View
                        style={{ backgroundColor: themeData.colors.ai }}
                        className="w-8 h-8 rounded-lg"
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}