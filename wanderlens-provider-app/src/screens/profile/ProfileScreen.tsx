import React, { useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ScreenHeader from '@/components/ScreenHeader'
import { useAuthStore } from '@/stores/authStore'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { useColors, useTheme, type AppColors, type ThemeMode } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'

export default function ProfileScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const { mode, setMode } = useTheme()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const themeOptions: { value: ThemeMode; label: string }[] = [
    { value: 'system', label: t('theme.system') },
    { value: 'light', label: t('theme.light') },
    { value: 'dark', label: t('theme.dark') },
  ]
  const { user, clearAuth } = useAuthStore()
  const [pushEnabled, setPushEnabled] = useState(true)
  const { permission } = usePushNotifications(pushEnabled)

  const handleLogout = () => {
    Alert.alert(t('profile.logout'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('profile.logoutConfirmBtn'), style: 'destructive', onPress: () => clearAuth() },
    ])
  }

  const menuItems = [
    { icon: 'create-outline' as const, label: t('account.hubTitle'), screen: 'AccountHub', color: colors.primary },
    { icon: 'star-outline' as const, label: t('rating.myRating'), screen: 'Rating', color: colors.warning },
    { icon: 'notifications-outline' as const, label: t('notification.center'), screen: 'Notifications', color: colors.primary },
  ]

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('profile.title')} large />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* 個人資訊 */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.username?.charAt(0) || '?'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.userName}>{user?.username || t('home.photographer')}</Text>
            <Text style={styles.userAccount}>{user?.empno || ''}</Text>
            <View style={styles.roleBadge}>
              <Ionicons name="camera" size={12} color={colors.white} />
              <Text style={styles.roleText}>{user?.role || 'PROVIDER'}</Text>
            </View>
          </View>
        </View>

        {/* 推播設定 */}
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={[styles.menuIcon, { backgroundColor: colors.secondary + '18' }]}>
              <Ionicons name="notifications" size={20} color={colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>{t('profile.push')}</Text>
              <Text style={styles.settingDesc}>
                {permission === 'granted' ? t('profile.pushGranted') : permission === 'denied' ? t('profile.pushDenied') : t('profile.pushDesc')}
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={pushEnabled ? colors.primary : colors.white}
              accessibilityRole="switch"
              accessibilityLabel={t('profile.push')}
            />
          </View>
        </View>

        {/* 外觀主題 */}
        <View style={styles.settingsCard}>
          <View style={styles.settingRow}>
            <View style={[styles.menuIcon, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name="contrast-outline" size={20} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.settingLabel}>{t('theme.title')}</Text>
            </View>
          </View>
          <View style={styles.themeRow}>
            {themeOptions.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.themeChip, mode === opt.value && styles.themeChipActive]}
                onPress={() => setMode(opt.value)}
                accessibilityRole="button"
                accessibilityState={{ selected: mode === opt.value }}
                accessibilityLabel={opt.label}
              >
                <Text style={[styles.themeChipText, mode === opt.value && styles.themeChipTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 功能選單 */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.screen}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={[styles.menuIcon, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* 登出 */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} accessibilityRole="button" accessibilityLabel={t('profile.logout')}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>

        <Text style={styles.version}>WanderLens Provider v0.1.0</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: spacing.xxxl },
  profileCard: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.lg,
    backgroundColor: colors.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.xxl,
  },
  avatar: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 28, fontWeight: '800', color: colors.white },
  userName: { fontSize: 22, fontWeight: '800', color: colors.white },
  userAccount: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  roleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: spacing.sm,
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: radius.full, alignSelf: 'flex-start',
  },
  roleText: { fontSize: 12, color: colors.white, fontWeight: '600' },
  settingsCard: {
    backgroundColor: colors.surface, borderRadius: radius.lg, margin: spacing.lg, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  settingLabel: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  settingDesc: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  themeRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  themeChip: {
    flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: radius.md,
    backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border,
  },
  themeChipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  themeChipText: { fontSize: 13, color: colors.textRegular, fontWeight: '600' },
  themeChipTextActive: { color: colors.primary, fontWeight: '700' },
  menuSection: {
    backgroundColor: colors.surface, borderRadius: radius.lg, marginHorizontal: spacing.lg, overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.lg, paddingHorizontal: spacing.lg,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  menuIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.lg, margin: spacing.lg, padding: spacing.lg,
    borderWidth: 1, borderColor: colors.danger + '40',
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: colors.danger },
  version: { textAlign: 'center', fontSize: 12, color: colors.textSecondary, marginTop: spacing.md },
})
