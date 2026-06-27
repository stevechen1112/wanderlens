import React, { useEffect, useState, useCallback } from 'react'
import {
  View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator, Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColors, AppColors } from '@/theme'
import Button from '@/components/Button'
import { matchApi } from '@/api'
import { useLocale } from '@/i18n'
import { haptics } from '@/utils/haptics'
import type { MatchBroadcastPayload } from '@/api/matchTypes'

interface Props {
  payload: MatchBroadcastPayload | null
  onClose: () => void
  onAccepted: (requestId: number) => void
}

export default function MatchRequestModal({ payload, onClose, onAccepted }: Props) {
  const { t } = useLocale()
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const [countdown, setCountdown] = useState(15)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!payload) return
    setCountdown(payload.responseSeconds || 15)
    const timer = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(timer)
          onClose()
          return 0
        }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [payload, onClose])

  const accept = async () => {
    if (!payload?.requestId) return
    setLoading(true)
    try {
      await matchApi.acceptRequest(payload.requestId)
      haptics.success()
      onAccepted(payload.requestId)
      onClose()
      Alert.alert(t('match.acceptedTitle'), t('match.acceptedDesc'))
    } catch (err: any) {
      Alert.alert(t('match.failedTitle'), err?.message || t('match.failedDesc'))
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const decline = async () => {
    if (payload?.requestId) await matchApi.declineRequest(payload.requestId).catch(() => {})
    onClose()
  }

  if (!payload) return null

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Ionicons name="flash" size={16} color={colors.white} />
              <Text style={styles.badgeText}>{t('match.newRequest')}</Text>
            </View>
            <TouchableOpacity onPress={decline} accessibilityRole="button" accessibilityLabel={t('common.close')}>
              <Ionicons name="close" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.location}>{payload.shootingLocation}</Text>
          <View style={styles.metaRow}>
            <Meta icon="time-outline" label={t('match.hours', { n: payload.durationHours || 1 })} />
            <Meta icon="cash-outline" label={`$${(payload.estimatedIncome || 0).toLocaleString()}`} />
            <Meta icon="navigate-outline" label={`${payload.distanceKm || 0} km`} />
          </View>

          <View style={styles.countdownWrap}>
            <Text style={styles.countdownLabel}>{t('match.countdown')}</Text>
            <Text style={styles.countdown}>{countdown}s</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.declineBtn} onPress={decline} disabled={loading} accessibilityRole="button" accessibilityLabel={t('match.skip')}>
              <Text style={styles.declineText}>{t('match.skip')}</Text>
            </TouchableOpacity>
            <Button
              label={t('match.accept')}
              onPress={accept}
              loading={loading}
              haptic={false}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  )
}

function Meta({ icon, label }: { icon: keyof typeof Ionicons.glyphMap; label: string }) {
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  return (
    <View style={styles.metaItem}>
      <Ionicons name={icon} size={16} color={colors.secondary} />
      <Text style={styles.metaText}>{label}</Text>
    </View>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingBottom: 36,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
  },
  badgeText: { color: colors.white, fontWeight: '700', fontSize: 13 },
  location: { fontSize: 20, fontWeight: '800', color: colors.textPrimary, marginBottom: 16 },
  metaRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 14, color: colors.textRegular, fontWeight: '600' },
  countdownWrap: { alignItems: 'center', marginBottom: 24 },
  countdownLabel: { fontSize: 14, color: colors.textSecondary },
  countdown: { fontSize: 48, fontWeight: '800', color: colors.primary, marginTop: 4 },
  actions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  declineBtn: {
    paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: colors.border,
  },
  declineText: { fontSize: 16, fontWeight: '600', color: colors.textSecondary },
})
