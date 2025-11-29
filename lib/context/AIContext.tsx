import React, { createContext, useContext, useState } from 'react';
import { GoogleGenAI } from '@google/genai';

interface AIContextType {
  generateTaskSuggestions: (taskTitle: string, taskDescription: string) => Promise<string>;
  generateSubtasks: (taskTitle: string, taskDescription: string) => Promise<string[]>;
  analyzeTaskPriority: (tasks: any[]) => Promise<string>;
  createTaskFromPrompt: (prompt: string) => Promise<{ title: string; description: string }>;
  isLoading: boolean;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  // API Key desde variables de entorno
  const APIKEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  // Inicializar Google GenAI
  const getAI = () => {
    if (!APIKEY) {
      throw new Error('API Key de Google GenAI no configurada en .env');
    }
    return new GoogleGenAI({ apiKey: APIKEY });
  };

  // 🤖 Generar sugerencias para completar una tarea
  const generateTaskSuggestions = async (
    taskTitle: string,
    taskDescription: string
  ): Promise<string> => {
    setIsLoading(true);
    try {
      const ai = getAI();

      const context = `Eres un asistente experto en productividad. 
Tarea: "${taskTitle}"
Descripción: "${taskDescription}"

Proporciona 3-5 consejos prácticos y concretos para completar esta tarea eficientemente.
Responde en español, en formato de lista simple, directo y sin introducción.`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: context,
      });

      if (result.text) {
        return result.text;
      } else {
        throw new Error('No se pudo obtener una respuesta');
      }
    } catch (error) {
      console.error('Error al generar sugerencias:', error);
      return 'No se pudieron generar sugerencias. Verifica tu conexión o API Key.';
    } finally {
      setIsLoading(false);
    }
  };

  // 🧩 Generar subtareas automáticamente
  const generateSubtasks = async (
    taskTitle: string,
    taskDescription: string
  ): Promise<string[]> => {
    setIsLoading(true);
    try {
      const ai = getAI();

      const context = `Descompón esta tarea en 3-5 pasos accionables y específicos:
Tarea: "${taskTitle}"
Descripción: "${taskDescription}"

Responde SOLO en español con la lista de pasos, uno por línea, sin numeración ni viñetas ni guiones.`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: context,
      });

      if (result.text) {
        // Dividir por líneas y limpiar
        return result.text
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => {
            // Eliminar líneas vacías y las que empiezan con -, *, números
            return line.length > 0 && 
                   !line.startsWith('-') && 
                   !line.startsWith('*') &&
                   !line.match(/^\d+\./);
          })
          .slice(0, 5);
      } else {
        throw new Error('No se pudieron generar subtareas');
      }
    } catch (error) {
      console.error('Error al generar subtareas:', error);
      return ['No se pudieron generar subtareas'];
    } finally {
      setIsLoading(false);
    }
  };

  // 📊 Analizar prioridades de tareas
  const analyzeTaskPriority = async (tasks: any[]): Promise<string> => {
    setIsLoading(true);
    try {
      const ai = getAI();

      const taskList = tasks
        .map((t, i) => `${i + 1}. ${t.title} - ${t.completed ? 'Completada' : 'Pendiente'}`)
        .join('\n');

      const context = `Analiza estas tareas y sugiere un orden óptimo de ejecución:

${taskList}

Proporciona un análisis breve en español (máximo 4 líneas) con recomendaciones de prioridad basadas en urgencia e importancia.`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: context,
      });

      if (result.text) {
        return result.text;
      } else {
        throw new Error('No se pudo analizar');
      }
    } catch (error) {
      console.error('Error al analizar prioridades:', error);
      return 'No se pudo analizar las prioridades.';
    } finally {
      setIsLoading(false);
    }
  };

  // ✨ Crear tarea desde lenguaje natural
  const createTaskFromPrompt = async (
    prompt: string
  ): Promise<{ title: string; description: string }> => {
    setIsLoading(true);
    try {
      const ai = getAI();

      const context = `Convierte este texto en una tarea estructurada:
"${prompt}"

Responde EXACTAMENTE en este formato (sin explicaciones adicionales) y en español:
TITULO: [título breve de máximo 6 palabras]
DESCRIPCION: [descripción detallada en 1-2 oraciones]`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: context,
      });

      if (result.text) {
        const text = result.text;

        // Extraer título y descripción
        const titleMatch = text.match(/TITULO:\s*(.+)/i);
        const descMatch = text.match(/DESCRIPCION:\s*(.+)/i);

        const title = titleMatch ? titleMatch[1].trim() : prompt.slice(0, 50);
        const description = descMatch ? descMatch[1].trim() : prompt;

        return { title, description };
      } else {
        throw new Error('No se pudo crear la tarea');
      }
    } catch (error) {
      console.error('Error al crear tarea desde prompt:', error);
      // Fallback: usar el prompt como título
      return {
        title: prompt.slice(0, 50),
        description: prompt,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AIContext.Provider
      value={{
        generateTaskSuggestions,
        generateSubtasks,
        analyzeTaskPriority,
        createTaskFromPrompt,
        isLoading,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI debe usarse dentro de AIProvider');
  }
  return context;
}