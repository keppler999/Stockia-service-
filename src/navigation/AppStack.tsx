import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LicenceBlockScreen from '../screens/LicenceBlockScreen';
import MainTabs from './MainTabs';
import LicenceService from '../services/LicenceService';
import { View, Text, StyleSheet } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    checkLicence();
  }, []);

  const checkLicence = async () => {
    const status = await LicenceService.checkLicence();
    setIsValid(status.isValid);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>🏪 Stockia</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isValid ? (
        <Stack.Screen name="MainTabs" component={MainTabs} />
      ) : (
        <Stack.Screen name="LicenceBlock" component={LicenceBlockScreen} />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628', justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 40, fontWeight: 'bold', color: '#FFFFFF' },
});
