import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,   // 👈 CABECERA DESACTIVADA
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#E5E7EB",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Mis Tareas",
          tabBarLabel: "Tareas",
          tabBarIcon: ({ color }) => (
            <></>
          ),
        }}
      />

      <Tabs.Screen
        name="create-task"
        options={{
          title: "Nueva Tarea",
          tabBarLabel: "Crear",
          tabBarIcon: ({ color }) => (
            <></>
          ),
        }}
      />
    </Tabs>
  );
}
