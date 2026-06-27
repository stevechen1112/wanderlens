import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColors, AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'

interface Props {
  label: string
  value: string | number
  icon: keyof typeof Ionicons.glyphMap
  accent?: string
  style?: ViewStyle
}

export default function StatCard({ label, value, icon, accent, style }: Props) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const resolvedAccent = accent ?? colors.primary
  return (
    <View style={[styles.card, style]}>
      <View style={[styles.iconWrap, { backgroundColor: resolvedAccent + '18' }]}>
        <Ionicons name={icon} size={22} color={resolvedAccent} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 100,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  value: { fontSize: 22, fontWeight: '800', color: colors.textPrimary },
  label: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
})
