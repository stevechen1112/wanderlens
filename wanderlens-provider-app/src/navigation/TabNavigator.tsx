import React from 'react'
import { Platform, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Ionicons } from '@expo/vector-icons'
import { useColors, AppColors } from '@/theme'
import { useLocale } from '@/i18n'
import HomeScreen from '@/screens/home/HomeScreen'
import ScheduleScreen from '@/screens/schedule/ScheduleScreen'
import OrderListScreen from '@/screens/order/OrderListScreen'
import OrderDetailScreen from '@/screens/order/OrderDetailScreen'
import ConversationListScreen from '@/screens/conversation/ConversationListScreen'
import ConversationRoomScreen from '@/screens/conversation/ConversationRoomScreen'
import EarningsScreen from '@/screens/earnings/EarningsScreen'
import ProfileScreen from '@/screens/profile/ProfileScreen'
import RatingScreen from '@/screens/rating/RatingScreen'
import NotificationScreen from '@/screens/notification/NotificationScreen'
import type {
  ConversationStackParamList,
  HomeStackParamList,
  OrderStackParamList,
  ProfileStackParamList,
  TabParamList,
} from '@/navigation/types'

const Tab = createBottomTabNavigator<TabParamList>()
const HomeStack = createNativeStackNavigator<HomeStackParamList>()
const OrderStack = createNativeStackNavigator<OrderStackParamList>()
const ConversationStack = createNativeStackNavigator<ConversationStackParamList>()
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>()

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </HomeStack.Navigator>
  )
}

function OrderStackNavigator() {
  return (
    <OrderStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <OrderStack.Screen name="OrderList" component={OrderListScreen} />
      <OrderStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrderStack.Navigator>
  )
}

function ConversationStackNavigator() {
  return (
    <ConversationStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <ConversationStack.Screen name="ConversationList" component={ConversationListScreen} />
      <ConversationStack.Screen name="ConversationRoom" component={ConversationRoomScreen} />
    </ConversationStack.Navigator>
  )
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="Rating" component={RatingScreen} />
      <ProfileStack.Screen name="Notifications" component={NotificationScreen} />
    </ProfileStack.Navigator>
  )
}

export default function TabNavigator() {
  const { t } = useLocale()
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
          tabBarLabel: t('nav.home'),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" color={color} size={size} />
          ),
          tabBarLabel: t('nav.schedule'),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt-outline" color={color} size={size} />
          ),
          tabBarLabel: t('nav.orders'),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={ConversationStackNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" color={color} size={size} />
          ),
          tabBarLabel: t('nav.conversations'),
        }}
      />
      <Tab.Screen
        name="Earnings"
        component={EarningsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" color={color} size={size} />
          ),
          tabBarLabel: t('nav.earnings'),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
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

const makeStyles = (colors: AppColors) => StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    paddingTop: Platform.OS === 'ios' ? 4 : 0,
    height: Platform.OS === 'ios' ? 88 : 64,
  },
  tabLabel: { fontSize: 11, fontWeight: '600', marginBottom: Platform.OS === 'ios' ? 0 : 8 },
})
