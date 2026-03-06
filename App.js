import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

import AuthScreen from './screens/AuthScreen';
import PackagesScreen from './screens/PackagesScreen';
import WishlistScreen from './screens/WishlistScreen';
import SubscriptionScreen from './screens/SubscriptionScreen';
import ItineraryBuilderScreen from './screens/ItineraryBuilderScreen';
import PackageDetailsScreen from './screens/PackageDetailsScreen';
import GroupBookingScreen from './screens/GroupBookingScreen';
import AIPlannerScreen from './screens/AIPlannerScreen';
import WildlifeCalendarScreen from './screens/WildlifeCalendarScreen';
import OfflineGuidesScreen from './screens/OfflineGuidesScreen';
import SettingsScreen from './screens/SettingsScreen';
import ARScannerScreen from './screens/ARScannerScreen';
import ChatbotScreen from './screens/ChatbotScreen';
import UpsellScreen from './screens/UpsellScreen';
import FloatingChatIcon from './components/FloatingChatIcon';
import { CurrencyProvider } from './context/CurrencyContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { t } = useLanguage();

  return (
    <View style={{ flex: 1 }}>
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
            title: t('discover') || 'Discover',
            tabBarIcon: ({ color, size }) => (
              <Feather name="compass" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Wishlist"
          component={WishlistScreen}
          options={{
            title: t('wishlist') || 'Wishlist',
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="hearto" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Premium"
          component={SubscriptionScreen}
          options={{
            title: t('premium') || 'Premium',
            tabBarIcon: ({ color, size }) => (
              <Feather name="star" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Planner"
          component={ItineraryBuilderScreen}
          options={{
            title: t('planner') || 'Planner',
            tabBarIcon: ({ color, size }) => (
              <Feather name="map" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="AI"
          component={AIPlannerScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="robot-outline" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Guides"
          component={OfflineGuidesScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Feather name="download-cloud" size={size} color={color} />
            )
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: t('settings') || 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Feather name="settings" size={size} color={color} />
            )
          }}
        />
      </Tab.Navigator>
      <FloatingChatIcon />
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <CurrencyProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <Stack.Navigator
              initialRouteName="Auth"
              screenOptions={{
                headerShown: false,
                animation: 'fade',
              }}
            >
              <Stack.Screen name="Auth" component={AuthScreen} />
              <Stack.Screen name="Packages" component={MainTabs} />
              <Stack.Screen name="PackageDetails" component={PackageDetailsScreen} />
              <Stack.Screen name="GroupBooking" component={GroupBookingScreen} />
              <Stack.Screen name="WildlifeCalendar" component={WildlifeCalendarScreen} />
              <Stack.Screen name="ARScanner" component={ARScannerScreen} />
              <Stack.Screen name="Chatbot" component={ChatbotScreen} />
              <Stack.Screen name="Upsell" component={UpsellScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </CurrencyProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
