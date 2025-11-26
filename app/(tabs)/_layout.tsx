import { Tabs } from 'expo-router';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useAuth } from '@/lib/context/AuthContext';

export default function TabsLayout() {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: () => logout()
        }
      ]
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#ffffff',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerRight: () => (
          <TouchableOpacity
            onPress={handleLogout}
            className="mr-4 px-3 py-2 bg-gray-100 rounded-lg"
            activeOpacity={0.7}
          >
            <Text className="text-gray-700 text-sm font-medium">Salir</Text>
          </TouchableOpacity>
        ),
        tabBarActiveTintColor: '#111827',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Mis Tareas',
          tabBarLabel: 'Tareas',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>📋</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="create-task"
        options={{
          title: 'Nueva Tarea',
          tabBarLabel: 'Crear',
          tabBarIcon: ({ color }) => (
            <Text style={{ fontSize: 24, color }}>➕</Text>
          ),
        }}
      />
    </Tabs>
  );
}