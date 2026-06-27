import React from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColors, type AppColors } from '@/theme'
import { useAuthStore } from '@/stores/authStore'
import { haptics } from '@/utils/haptics'

export default function ProfileScreen({ navigation }: any) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { user, clearAuth } = useAuthStore()

  const handleLogout = () => {
    haptics.warning()
    Alert.alert(
      '登出',
      '確認要登出嗎？',
      [
        { text: '取消', style: 'cancel' },
        { text: '確認登出', style: 'destructive', onPress: () => clearAuth() },
      ]
    )
  }

  const menuItems = [
    { icon: 'receipt-outline', label: '我的訂單', screen: 'OrderList', color: colors.primary },
    { icon: 'notifications-outline', label: '通知', screen: 'Notifications', color: colors.warning },
    { icon: 'settings-outline', label: '設定', screen: 'Settings', color: colors.primary },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {/* 個人資訊卡片 */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.username?.charAt(0) || '?'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.username || '使用者'}</Text>
            <Text style={styles.userAccount}>{user?.empno || ''}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>{user?.role || ''}</Text>
            </View>
          </View>
        </View>

        {/* 功能選單 */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => navigation?.navigate?.(item.screen)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon as any} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* 登出按鈕 */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="登出"
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>登出</Text>
        </TouchableOpacity>

        {/* 版本資訊 */}
        <Text style={styles.versionText}>WanderLens v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary,
    paddingHorizontal: 20, paddingVertical: 24, gap: 16,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: '700', color: colors.white },
  userName: { fontSize: 20, fontWeight: 'bold', color: colors.white },
  userAccount: { fontSize: 14, color: colors.white, opacity: 0.8, marginTop: 2 },
  roleBadge: {
    marginTop: 6, backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, alignSelf: 'flex-start',
  },
  roleText: { fontSize: 12, color: colors.white, fontWeight: '500' },
  menuSection: { backgroundColor: colors.surface, borderRadius: 12, margin: 16, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: 12,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 15, color: colors.text },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.surface, borderRadius: 12, marginHorizontal: 16, paddingVertical: 14, gap: 8,
  },
  logoutText: { fontSize: 16, color: colors.danger, fontWeight: '600' },
  versionText: { textAlign: 'center', fontSize: 12, color: colors.textSecondary, marginTop: 16 },
})