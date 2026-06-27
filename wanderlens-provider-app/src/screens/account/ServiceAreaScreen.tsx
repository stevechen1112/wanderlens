import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import ScreenHeader from '@/components/ScreenHeader'
import Button from '@/components/Button'
import { providerApi } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'

interface AreaNode {
  id: number
  name: string
  minHours?: number
  children?: AreaNode[]
}

function flattenNodes(nodes: AreaNode[], depth = 0): Array<AreaNode & { depth: number }> {
  const out: Array<AreaNode & { depth: number }> = []
  for (const n of nodes) {
    out.push({ ...n, depth })
    if (n.children?.length) {
      out.push(...flattenNodes(n.children, depth + 1))
    }
  }
  return out
}

export default function ServiceAreaScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const { providerId } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [rootNodes, setRootNodes] = useState<AreaNode[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())

  const flatNodes = useMemo(() => flattenNodes(rootNodes), [rootNodes])

  const load = useCallback(async () => {
    if (!providerId) return
    setLoading(true)
    try {
      const res: any = await providerApi.getServiceArea(providerId)
      const raw = res.data?.rootNodes || []
      setRootNodes(raw)
      setSelected(new Set(res.data?.selectedNodes || []))
    } catch {
      Alert.alert(t('common.errorTitle'), t('account.loadFailed'))
    } finally {
      setLoading(false)
    }
  }, [providerId, t])

  useEffect(() => { load() }, [load])

  const toggle = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const save = async () => {
    if (!providerId) return
    setSaving(true)
    try {
      await providerApi.setServiceArea(providerId, {
        rootNodes: rootNodes.map(n => n.id),
        selectedNodes: Array.from(selected),
      })
      Alert.alert(t('common.successTitle'), t('account.saveSuccess'))
    } catch {
      Alert.alert(t('common.errorTitle'), t('account.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('account.serviceArea')} onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.desc}>{t('account.serviceAreaDesc')}</Text>
          {flatNodes.map(node => {
            const checked = selected.has(node.id)
            return (
              <TouchableOpacity
                key={node.id}
                style={[styles.row, { paddingLeft: spacing.lg + node.depth * 16 }]}
                onPress={() => toggle(node.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked }}
              >
                <Ionicons
                  name={checked ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={checked ? colors.primary : colors.textSecondary}
                />
                <Text style={styles.rowLabel}>
                  {node.name}
                  {node.minHours ? ` (${t('account.minHours', { hours: node.minHours })})` : ''}
                </Text>
              </TouchableOpacity>
            )
          })}
          <Button label={t('account.save')} onPress={save} loading={saving} fullWidth />
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.sm },
  desc: { fontSize: 14, color: colors.textSecondary, marginBottom: spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingRight: spacing.lg,
  },
  rowLabel: { flex: 1, fontSize: 15, color: colors.textPrimary },
})
