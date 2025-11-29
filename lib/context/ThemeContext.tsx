import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'normal' | 'dark' | 'christmas' | 'halloween' | 'cute';

interface Theme {
  name: string;
  icon: string;
  colors: {
    // Fondos
    background: string;
    surface: string;
    card: string;
    
    // Textos
    text: string;
    textSecondary: string;
    
    // Botones y elementos interactivos
    primary: string;
    primaryText: string;
    secondary: string;
    
    // Estados
    success: string;
    danger: string;
    warning: string;
    
    // Específicos
    progress: string;
    border: string;
    shadow: string;
    
    // Botón IA
    ai: string;
    aiText: string;
  };
}

const themes: Record<ThemeType, Theme> = {
  normal: {
    name: 'Normal',
    icon: '☀️',
    colors: {
      background: '#FFFFFF',
      surface: '#F9FAFB',
      card: '#DBEAFE',
      text: '#111827',
      textSecondary: '#6B7280',
      primary: '#000000',
      primaryText: '#FFFFFF',
      secondary: '#E5E7EB',
      success: '#10B981',
      danger: '#EF4444',
      warning: '#F59E0B',
      progress: '#3B82F6',
      border: '#D1D5DB',
      shadow: '#000000',
      ai: '#9333EA',
      aiText: '#FFFFFF',
    },
  },
  
  dark: {
    name: 'Oscuro',
    icon: '🌙',
    colors: {
      background: '#0F172A',
      surface: '#1E293B',
      card: '#334155',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      primary: '#3B82F6',
      primaryText: '#FFFFFF',
      secondary: '#475569',
      success: '#10B981',
      danger: '#EF4444',
      warning: '#F59E0B',
      progress: '#60A5FA',
      border: '#475569',
      shadow: '#000000',
      ai: '#A855F7',
      aiText: '#FFFFFF',
    },
  },
  
  christmas: {
    name: 'Navideño',
    icon: '🎄',
    colors: {
      background: '#FEF2F2',
      surface: '#FFEDD5',
      card: '#FEE2E2',
      text: '#7F1D1D',
      textSecondary: '#991B1B',
      primary: '#DC2626',
      primaryText: '#FFFFFF',
      secondary: '#16A34A',
      success: '#16A34A',
      danger: '#DC2626',
      warning: '#F59E0B',
      progress: '#DC2626',
      border: '#FCA5A5',
      shadow: '#991B1B',
      ai: '#16A34A',
      aiText: '#FFFFFF',
    },
  },
  
  halloween: {
    name: 'Halloween',
    icon: '🎃',
    colors: {
      background: '#18181B',
      surface: '#27272A',
      card: '#3F3F46',
      text: '#FF8C00',
      textSecondary: '#A1A1AA',
      primary: '#FF6B00',
      primaryText: '#000000',
      secondary: '#7C3AED',
      success: '#16A34A',
      danger: '#EF4444',
      warning: '#FF8C00',
      progress: '#FF6B00',
      border: '#52525B',
      shadow: '#7C3AED',
      ai: '#7C3AED',
      aiText: '#FFFFFF',
    },
  },
  
  cute: {
    name: 'Cute',
    icon: '🌸',
    colors: {
      background: '#FDF4FF',
      surface: '#FCE7F3',
      card: '#FBCFE8',
      text: '#831843',
      textSecondary: '#9D174D',
      primary: '#EC4899',
      primaryText: '#FFFFFF',
      secondary: '#F472B6',
      success: '#10B981',
      danger: '#F87171',
      warning: '#FBBF24',
      progress: '#EC4899',
      border: '#F9A8D4',
      shadow: '#BE185D',
      ai: '#A855F7',
      aiText: '#FFFFFF',
    },
  },
};

interface ThemeContextType {
  theme: ThemeType;
  currentTheme: Theme;
  setTheme: (theme: ThemeType) => Promise<void>;
  themes: Record<ThemeType, Theme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('normal');

  // Cargar tema guardado al iniciar
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme && themes[savedTheme as ThemeType]) {
        setThemeState(savedTheme as ThemeType);
      }
    } catch (error) {
      console.error('Error al cargar tema:', error);
    }
  };

  const setTheme = async (newTheme: ThemeType) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error('Error al guardar tema:', error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        currentTheme: themes[theme],
        setTheme,
        themes,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
}