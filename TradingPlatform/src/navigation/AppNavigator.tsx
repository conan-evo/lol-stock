import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../store/AuthContext';
import { RootStackParamList, BottomTabParamList } from '../types';

// Auth Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';

// Main App Screens
import DashboardScreen from '../screens/DashboardScreen';
import MarketsScreen from '../screens/MarketsScreen';
import PortfolioScreen from '../screens/PortfolioScreen';
import TradingScreen from '../screens/TradingScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        presentation: 'card',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a1a',
          borderTopColor: '#333333',
          borderTopWidth: 1,
          height: 90,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#00d4aa',
        tabBarInactiveTintColor: '#8e8e93',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Markets':
              iconName = focused ? 'trending-up' : 'trending-up-outline';
              break;
            case 'Portfolio':
              iconName = focused ? 'pie-chart' : 'pie-chart-outline';
              break;
            case 'Trading':
              iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen 
        name="Markets" 
        component={MarketsScreen}
        options={{ tabBarLabel: 'Markets' }}
      />
      <Tab.Screen 
        name="Portfolio" 
        component={PortfolioScreen}
        options={{ tabBarLabel: 'Portfolio' }}
      />
      <Tab.Screen 
        name="Trading" 
        component={TradingScreen}
        options={{ tabBarLabel: 'Trade' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Main" component={MainTabs} />
      {/* Add other screens that should be accessible from main app */}
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  const { state } = useAuth();

  if (state.loading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      {state.isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}