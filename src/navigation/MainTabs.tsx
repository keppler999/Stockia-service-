import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const PlaceholderScreen = ({ title }: { title: string }) => (
  <View style={styles.screen}>
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.subtitle}>En développement</Text>
  </View>
);

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Dashboard: focused ? 'home' : 'home-outline',
            Caisse: focused ? 'cash' : 'cash-outline',
            Stock: focused ? 'cube' : 'cube-outline',
            Clients: focused ? 'people' : 'people-outline',
            Parametres: focused ? 'settings' : 'settings-outline',
          };
          return <Ionicons name={icons[route.name as keyof typeof icons]} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1565C0',
        tabBarInactiveTintColor: '#78909C',
        headerStyle: { backgroundColor: '#0A1628' },
        headerTintColor: '#FFFFFF',
      })}
    >
      <Tab.Screen name="Dashboard" component={() => <PlaceholderScreen title="📊 Dashboard" />} />
      <Tab.Screen name="Caisse" component={() => <PlaceholderScreen title="💰 Caisse" />} />
      <Tab.Screen name="Stock" component={() => <PlaceholderScreen title="📦 Stock" />} />
      <Tab.Screen name="Clients" component={() => <PlaceholderScreen title="👥 Clients" />} />
      <Tab.Screen name="Parametres" component={() => <PlaceholderScreen title="⚙️ Paramètres" />} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0A1628' },
  subtitle: { fontSize: 16, color: '#78909C', marginTop: 8 },
});
