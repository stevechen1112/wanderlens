import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View, Text, TextInput, ScrollView, StyleSheet, Alert, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScreenHeader from '@/components/ScreenHeader'
import Button from '@/components/Button'
import { providerApi } from '@/api'
import { useColors, type AppColors } from '@/theme'
import { radius, spacing } from '@/theme/spacing'
import { useLocale } from '@/i18n'

export default function BankInfoScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const styles = useMemo(() => makeStyles(colors), [colors])
  const { t } = useLocale()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    bankCode: '',
    bankName: '',
    bankBranch: '',
    accountName: '',
    accountNo: '',
    note: '',
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res: any = await providerApi.getBank()
      const data = res.data || {}
      setForm({
        bankCode: data.bankCode || '',
        bankName: data.bankName || '',
        bankBranch: data.bankBranch || '',
        accountName: data.accountName || '',
        accountNo: data.accountNo || '',
        note: data.note || '',
      })
    } catch {
      Alert.alert(t('common.errorTitle'), t('account.loadFailed'))
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => { load() }, [load])

  const setField = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const save = async () => {
    if (!form.bankCode || !form.bankName || !form.accountName || !form.accountNo) {
      Alert.alert(t('common.errorTitle'), t('account.bankRequired'))
      return
    }
    setSaving(true)
    try {
      await providerApi.setBank(form)
      Alert.alert(t('common.successTitle'), t('account.saveSuccess'))
    } catch {
      Alert.alert(t('common.errorTitle'), t('account.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  const fields: Array<{ key: keyof typeof form; label: string; keyboard?: 'numeric' }> = [
    { key: 'bankCode', label: t('account.bankCode'), keyboard: 'numeric' },
    { key: 'bankName', label: t('account.bankName') },
    { key: 'bankBranch', label: t('account.bankBranch') },
    { key: 'accountName', label: t('account.accountName') },
    { key: 'accountNo', label: t('account.accountNo'), keyboard: 'numeric' },
    { key: 'note', label: t('account.bankNote') },
  ]

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScreenHeader title={t('account.bankInfo')} onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Text style={styles.desc}>{t('account.bankDesc')}</Text>
          {fields.map(f => (
            <View key={f.key} style={styles.field}>
              <Text style={styles.label}>{f.label}</Text>
              <TextInput
                style={styles.input}
                value={form[f.key]}
                onChangeText={v => setField(f.key, v)}
                keyboardType={f.keyboard}
                placeholder={f.label}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          ))}
          <Button label={t('account.save')} onPress={save} loading={saving} fullWidth />
        </ScrollView>
      )}
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.lg, gap: spacing.md },
  desc: { fontSize: 14, color: colors.textSecondary },
  field: { gap: spacing.xs },
  label: { fontSize: 14, fontWeight: '600', color: colors.textPrimary },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
})
