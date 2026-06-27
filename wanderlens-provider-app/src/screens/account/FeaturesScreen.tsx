import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal,
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

interface FeatureRow {
  id: number
  featureType: string
  featureContent: string
}

const TYPES = [
  { value: 'style', labelKey: 'account.featureStyle' },
  { value: 'service', labelKey: 'account.featureService' },
  { value: 'equipment', labelKey: 'account.featureEquipment' },
]

export default function FeaturesScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const { providerId } = useAuthStore()
  const [rows, setRows] = useState<FeatureRow[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<FeatureRow | null>(null)
  const [featureType, setFeatureType] = useState('style')
  const [featureContent, setFeatureContent] = useState('')

  const load = useCallback(async () => {
    if (!providerId) return
    try {
      const res: any = await providerApi.getFeatures(providerId)
      setRows(res.data || [])
    } catch {
      Alert.alert(t('common.errorTitle'), t('account.loadFailed'))
    }
  }, [providerId, t])

  useEffect(() => { load() }, [load])

  const openAdd = () => {
    setEditing(null)
    setFeatureType('style')
    setFeatureContent('')
    setShowModal(true)
  }

  const openEdit = (row: FeatureRow) => {
    setEditing(row)
    setFeatureType(row.featureType)
    setFeatureContent(row.featureContent)
    setShowModal(true)
  }

  const save = async () => {
    if (!providerId || !featureContent.trim()) return
    try {
      await providerApi.setFeature({
        id: editing?.id,
        providerId,
        language: 'tw',
        featureType,
        featureContent: featureContent.trim(),
      })
      setShowModal(false)
      load()
    } catch {
      Alert.alert(t('common.errorTitle'), t('account.saveFailed'))
    }
  }

  const remove = (id: number) => {
    if (!providerId) return
    Alert.alert(t('account.deleteConfirm'), '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.confirm'),
        style: 'destructive',
        onPress: async () => {
          try {
            await providerApi.deleteFeature(id, providerId)
            load()
          } catch {
            Alert.alert(t('common.errorTitle'), t('account.deleteFailed'))
          }
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('account.features')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {rows.map(row => (
          <View key={row.id} style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.type}>{row.featureType}</Text>
              <Text style={styles.content}>{row.featureContent}</Text>
            </View>
            <TouchableOpacity onPress={() => openEdit(row)} style={styles.iconBtn}>
              <Ionicons name="create-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => remove(row.id)} style={styles.iconBtn}>
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
          </View>
        ))}
        <Button label={t('account.addFeature')} onPress={openAdd} variant="outline" />
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{editing ? t('account.editFeature') : t('account.addFeature')}</Text>
            <View style={styles.chipRow}>
              {TYPES.map(tp => (
                <TouchableOpacity
                  key={tp.value}
                  style={[styles.chip, featureType === tp.value && styles.chipActive]}
                  onPress={() => setFeatureType(tp.value)}
                >
                  <Text style={[styles.chipText, featureType === tp.value && styles.chipTextActive]}>{t(tp.labelKey)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.textarea}
              value={featureContent}
              onChangeText={setFeatureContent}
              multiline
              placeholder={t('account.featureContent')}
              placeholderTextColor={colors.textSecondary}
            />
            <View style={styles.modalActions}>
              <Button label={t('common.cancel')} variant="outline" onPress={() => setShowModal(false)} style={{ flex: 1 }} />
              <Button label={t('account.save')} onPress={save} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.sm },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  type: { fontSize: 12, fontWeight: '700', color: colors.primary, marginBottom: 4 },
  content: { fontSize: 14, color: colors.textPrimary, lineHeight: 20 },
  iconBtn: { padding: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '18' },
  chipText: { fontSize: 13, color: colors.textSecondary },
  chipTextActive: { color: colors.primary, fontWeight: '600' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  textarea: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    textAlignVertical: 'top',
  },
  modalActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
})
