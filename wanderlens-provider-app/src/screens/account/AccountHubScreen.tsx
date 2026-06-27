import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ScreenHeader from '@/components/ScreenHeader'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'

const ITEMS = [
  { key: 'BasicInfo', icon: 'person-outline' as const, labelKey: 'account.basicInfo' },
  { key: 'Features', icon: 'sparkles-outline' as const, labelKey: 'account.features' },
  { key: 'Works', icon: 'images-outline' as const, labelKey: 'account.works' },
  { key: 'ServiceArea', icon: 'map-outline' as const, labelKey: 'account.serviceArea' },
  { key: 'BankInfo', icon: 'card-outline' as const, labelKey: 'account.bankInfo' },
]

export default function AccountHubScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('account.hubTitle')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.desc}>{t('account.hubDesc')}</Text>
        {ITEMS.map(item => (
          <TouchableOpacity
            key={item.key}
            style={styles.card}
            onPress={() => navigation.navigate(item.key)}
            accessibilityRole="button"
          >
            <View style={[styles.iconWrap, { backgroundColor: colors.primary + '18' }]}>
              <Ionicons name={item.icon} size={22} color={colors.primary} />
            </View>
            <Text style={styles.cardLabel}>{t(item.labelKey)}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.sm },
  desc: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.textPrimary },
})
