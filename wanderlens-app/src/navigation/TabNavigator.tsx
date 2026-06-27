import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { useColors } from '@/theme'
import { t } from '@/i18n'
import HomeScreen from '@/screens/home/HomeScreen'
import AlbumListScreen from '@/screens/album/AlbumListScreen'
import AlbumDetailScreen from '@/screens/album/AlbumDetailScreen'
import ConversationListScreen from '@/screens/conversation/ConversationListScreen'
import ConversationRoomScreen from '@/screens/conversation/ConversationRoomScreen'
import ProfileScreen from '@/screens/profile/ProfileScreen'
import BookingScreen from '@/screens/booking/BookingScreen'
import OrderListScreen from '@/screens/order/OrderListScreen'
import OrderDetailScreen from '@/screens/order/OrderDetailScreen'
import NotificationScreen from '@/screens/notification/NotificationScreen'
import SettingsScreen from '@/screens/settings/SettingsScreen'
import PreferencesScreen from '@/screens/settings/PreferencesScreen'
import ShootingHistoryScreen from '@/screens/history/ShootingHistoryScreen'

const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

// Album Stack
function AlbumStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="AlbumList" component={AlbumListScreen} />
      <Stack.Screen name="AlbumDetail" component={AlbumDetailScreen} />
    </Stack.Navigator>
  )
}

// Conversation Stack
function ConversationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ConversationList" component={ConversationListScreen} />
      <Stack.Screen name="ConversationRoom" component={ConversationRoomScreen} />
    </Stack.Navigator>
  )
}

// Profile Stack
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="OrderList" component={OrderListScreen} />
      <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
      <Stack.Screen name="Notifications" component={NotificationScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Preferences" component={PreferencesScreen} />
      <Stack.Screen name="ShootingHistory" component={ShootingHistoryScreen} />
    </Stack.Navigator>
  )
}

export default function TabNavigator() {
  const colors = useColors()
  return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
            tabBarLabel: t('nav.home'),
          }}
        />
        <Tab.Screen
          name="Albums"
          component={AlbumStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="images-outline" color={color} size={size} />
            ),
            tabBarLabel: t('nav.albums'),
          }}
        />
        <Tab.Screen
          name="Booking"
          component={BookingScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="camera-outline" color={color} size={size} />
            ),
            tabBarLabel: t('nav.booking'),
          }}
        />
        <Tab.Screen
          name="Conversations"
          component={ConversationStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-outline" color={color} size={size} />
            ),
            tabBarLabel: t('nav.conversations'),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={size} />
            ),
            tabBarLabel: t('nav.profile'),
          }}
        />
      </Tab.Navigator>
  )
}