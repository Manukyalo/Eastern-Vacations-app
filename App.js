import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather } from '@expo/vector-icons';

import AuthScreen from './screens/AuthScreen';
import PackagesScreen from './screens/PackagesScreen';
import WishlistScreen from './screens/WishlistScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0A0A0A',
          borderTopWidth: 1,
          borderTopColor: 'rgba(255,255,255,0.1)',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarActiveTintColor: '#E5A93C', // Premium Gold
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen
        name="Discover"
        component={PackagesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="compass" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="hearto" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="Premium"
        component={SubscriptionScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="star" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

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
        {/* We map "Packages" to the MainTabs so old navigation handles still work seamlessly */}
        <Stack.Screen name="Packages" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
