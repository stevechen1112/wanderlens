import React, { useState, useEffect } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Switch, Alert, ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColors, type AppColors } from '@/theme'
import { useAuthStore } from '@/stores/authStore'
import { useLocale } from '@/i18n'
import { usePushNotifications, registerPushNotifications } from '@/hooks/usePushNotifications'
import * as secureStorage from '@/utils/secureStorage'
import StateView from '@/components/StateView'
import { haptics } from '@/utils/haptics'

export default function SettingsScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { user, clearAuth } = useAuthStore()
  const { t, locale, setLocale } = useLocale()
  const [pushNotification, setPushNotification] = useState<boolean | null>(null)
  const [emailNotification, setEmailNotification] = useState(true)
  const [lineNotification, setLineNotification] = useState(false)

  useEffect(() => {
    secureStorage.getItemAsync('wl_push_enabled').then((v) => {
      setPushNotification(v === '0' ? false : true)
    })
  }, [])

  usePushNotifications(pushNotification === true)

  const handlePushToggle = async (value: boolean) => {
    setPushNotification(value)
    await secureStorage.setItemAsync('wl_push_enabled', value ? '1' : '0')
    if (value) {
      const token = await registerPushNotifications()
      if (!token) Alert.alert(t('settings.push'), t('settings.pushDenied'))
    }
  }

  const handleLogout = () => {
    haptics.warning()
    Alert.alert(
      t('profile.logoutTitle'),
      t('profile.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('profile.logout'), style: 'destructive', onPress: () => clearAuth() },
      ]
    )
  }

  const SettingItem = ({ icon, label, value, onPress, rightIcon, disabled }: any) => (
    <TouchableOpacity
      style={[styles.settingItem, disabled && styles.settingItemDisabled]}
      onPress={onPress}
      disabled={!onPress || disabled}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={{ disabled: !!disabled }}
      accessibilityLabel={label}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.settingIcon, disabled && styles.settingIconDisabled]}>
          <Ionicons name={icon} size={20} color={disabled ? colors.textSecondary : colors.primary} />
        </View>
        <Text style={[styles.settingLabel, disabled && styles.settingLabelDisabled]}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {value !== undefined && <Text style={styles.settingValue}>{value}</Text>}
        {rightIcon && <Ionicons name={rightIcon} size={16} color={colors.textSecondary} />}
      </View>
    </TouchableOpacity>
  )

  const ToggleItem = ({ icon, label, value, onToggle }: any) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <Text style={styles.settingLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: colors.primary + '40' }}
        thumbColor={value ? colors.primary : colors.white}
      />
    </View>
  )

  const toggleLocale = async () => {
    const next = locale === 'zh' ? 'en' : 'zh'
    await setLocale(next)
    Alert.alert(
      t('settings.language'),
      next === 'zh' ? t('settings.langSwitchedZh') : t('settings.langSwitchedEn'),
    )
  }

  if (pushNotification === null) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <StateView type="loading" />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
        <View style={styles.section}>
          <SettingItem icon="person-outline" label={t('settings.name')} value={user?.username || '-'} />
          <SettingItem icon="mail-outline" label={t('settings.accountId')} value={user?.empno || '-'} />
          <SettingItem icon="shield-outline" label={t('settings.role')} value={user?.role || '-'} />
        </View>

        <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>
        <View style={styles.section}>
          <SettingItem
            icon="heart-outline"
            label="拍攝偏好"
            onPress={() => navigation.navigate('Preferences')}
            rightIcon="chevron-forward"
          />
          <SettingItem
            icon="language-outline"
            label={t('settings.language')}
            value={locale === 'zh' ? t('settings.langZh') : t('settings.langEn')}
            onPress={toggleLocale}
            rightIcon="chevron-forward"
          />
        </View>

        <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
        <View style={styles.section}>
          <ToggleItem
            icon="notifications-outline"
            label={t('settings.push')}
            value={pushNotification}
            onToggle={handlePushToggle}
          />
          <ToggleItem icon="mail-outline" label={t('settings.email')} value={emailNotification} onToggle={setEmailNotification} />
          <ToggleItem icon="chatbubble-outline" label={t('settings.line')} value={lineNotification} onToggle={setLineNotification} />
        </View>

        <Text style={styles.sectionTitle}>{t('settings.other')}</Text>
        <View style={styles.section}>
          <SettingItem icon="document-text-outline" label={t('settings.privacy')} rightIcon="chevron-forward" onPress={() => {}} disabled />
          <SettingItem icon="help-circle-outline" label={t('settings.faq')} rightIcon="chevron-forward" onPress={() => {}} disabled />
          <SettingItem icon="information-circle-outline" label={t('settings.about')} value="v1.0.0" onPress={() => {}} disabled />
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel={t('profile.logout')}
        >
          <Ionicons name="log-out-outline" size={20} color={colors.danger} />
          <Text style={styles.logoutText}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 8, marginLeft: 4 },
  section: { backgroundColor: colors.surface, borderRadius: 12, marginBottom: 16, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  settingItemDisabled: { opacity: 0.5 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primary + '10', justifyContent: 'center', alignItems: 'center' },
  settingIconDisabled: { backgroundColor: colors.border },
  settingLabel: { fontSize: 15, color: colors.textPrimary },
  settingLabelDisabled: { color: colors.textSecondary },
  settingRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  settingValue: { fontSize: 14, color: colors.textSecondary },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, borderRadius: 12, paddingVertical: 14, gap: 8, marginTop: 8 },
  logoutText: { fontSize: 16, color: colors.danger, fontWeight: '600' },
})
