import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Tareas' }}
      />
      <Tabs.Screen 
        name="create-task" 
        options={{ title: 'Nueva Tarea' }}
      />
    </Tabs>
  );
}