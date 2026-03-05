import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from './screens/AuthScreen';
import PackagesScreen from './screens/PackagesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerShown: false, // hide header for all screens to keep the custom premium UI
          animation: 'fade', // fluid fade animation
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Packages" component={PackagesScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
