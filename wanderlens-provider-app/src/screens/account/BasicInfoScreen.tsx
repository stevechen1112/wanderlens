import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScreenHeader from '@/components/ScreenHeader'
import Button from '@/components/Button'
import { providerApi } from '@/api'
import { useAuthStore } from '@/stores/authStore'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'

const CAREER_OPTIONS = [
  { value: '全職攝影', labelKey: 'account.careerFull' },
  { value: '兼職攝影', labelKey: 'account.careerPart' },
] as const

interface ServiceType { id: number; name: string }

export default function BasicInfoScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const { providerId } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([])
  const [form, setForm] = useState({
    nickName: '',
    intro: '',
    career: '',
    experience: '',
    unitPrice: '',
    serviceTypeIds: [] as number[],
    providerUuid: '',
  })

  const load = useCallback(async () => {
    if (!providerId) return
    setLoading(true)
    try {
      const [providerRes, stRes]: any[] = await Promise.all([
        providerApi.getProvider(providerId),
        providerApi.getServiceTypes(),
      ])
      const p = providerRes.data || {}
      const ids = p.serviceItem
        ? String(p.serviceItem).split(',').map((s: string) => Number(s.trim())).filter(Boolean)
        : []
      setServiceTypes(stRes.data || [])
      setForm({
        nickName: p.nickName || '',
        intro: p.intro || '',
        career: p.career || '',
        experience: p.experience != null ? String(p.experience) : '',
        unitPrice: p.unitPrice != null ? String(p.unitPrice) : '',
        serviceTypeIds: ids,
        providerUuid: p.providerUuid || '',
      })
    } catch {
      Alert.alert(t('common.errorTitle'), t('account.loadFailed'))
    } finally {
      setLoading(false)
    }
  }, [providerId, t])

  useEffect(() => { load() }, [load])

  const toggleServiceType = (id: number) => {
    setForm(prev => ({
      ...prev,
      serviceTypeIds: prev.serviceTypeIds.includes(id)
        ? prev.serviceTypeIds.filter(x => x !== id)
        : [...prev.serviceTypeIds, id],
    }))
  }

  const save = async () => {
    if (!providerId) return
    setSaving(true)
    try {
      await providerApi.updateProvider({
        id: providerId,
        nickName: form.nickName,
        intro: form.intro,
        career: form.career || null,
        experience: form.experience ? Number(form.experience) : null,
        unitPrice: form.unitPrice ? Number(form.unitPrice) : null,
        serviceItem: form.serviceTypeIds.join(','),
      })
      Alert.alert(t('account.saveSuccess'))
    } catch {
      Alert.alert(t('common.errorTitle'), t('account.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const previewUrl = form.providerUuid
    ? `${process.env.EXPO_PUBLIC_CONSUMER_WEB_URL || 'https://www.wanderlenstw.com'}/photographer/${form.providerUuid}`
    : ''

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScreenHeader title={t('account.basicInfo')} onBack={() => navigation.goBack()} />
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('account.basicInfo')} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        {previewUrl ? <Text style={styles.preview}>{t('account.publicLink')}: {previewUrl}</Text> : null}

        <Text style={styles.label}>{t('account.nickName')}</Text>
        <TextInput style={styles.input} value={form.nickName} onChangeText={v => setForm(f => ({ ...f, nickName: v }))} />

        <Text style={styles.label}>{t('account.intro')}</Text>
        <TextInput style={[styles.input, styles.textarea]} value={form.intro} onChangeText={v => setForm(f => ({ ...f, intro: v }))} multiline />

        <Text style={styles.label}>{t('account.career')}</Text>
        <View style={styles.chipRow}>
          {CAREER_OPTIONS.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, form.career === opt.value && styles.chipActive]}
              onPress={() => setForm(f => ({ ...f, career: opt.value }))}
            >
              <Text style={[styles.chipText, form.career === opt.value && styles.chipTextActive]}>{t(opt.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>{t('account.experience')}</Text>
        <TextInput style={styles.input} value={form.experience} onChangeText={v => setForm(f => ({ ...f, experience: v }))} keyboardType="decimal-pad" />

        <Text style={styles.label}>{t('account.unitPrice')}</Text>
        <TextInput style={styles.input} value={form.unitPrice} onChangeText={v => setForm(f => ({ ...f, unitPrice: v }))} keyboardType="number-pad" placeholder={t('account.unitPriceHint')} placeholderTextColor={colors.textSecondary} />

        <Text style={styles.label}>{t('account.serviceTypes')}</Text>
        <View style={styles.chipRow}>
          {serviceTypes.map(st => (
            <TouchableOpacity
              key={st.id}
              style={[styles.chip, form.serviceTypeIds.includes(st.id) && styles.chipActive]}
              onPress={() => toggleServiceType(st.id)}
            >
              <Text style={[styles.chipText, form.serviceTypeIds.includes(st.id) && styles.chipTextActive]}>{st.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button label={t('account.save')} onPress={save} loading={saving} style={{ marginTop: spacing.lg }} />
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, paddingBottom: spacing.xl * 2 },
  preview: { fontSize: 12, color: colors.primary, marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: 6, marginTop: spacing.md },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  textarea: { minHeight: 100, textAlignVertical: 'top' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primary + '18' },
  chipText: { fontSize: 13, color: colors.textSecondary },
  chipTextActive: { color: colors.primary, fontWeight: '600' },
})
