import React, { useEffect, useState } from 'react'
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useColors, useTheme, type AppColors, type ThemeMode } from '@/theme'
import { bookingApi, preferenceApi } from '@/api'
import ScreenHeader from '@/components/ScreenHeader'
import Button from '@/components/Button'

const CITIES = ['台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市']

const THEME_OPTIONS: { value: ThemeMode; label: string }[] = [
  { value: 'system', label: '跟隨系統' },
  { value: 'light', label: '淺色' },
  { value: 'dark', label: '深色' },
]

export default function PreferencesScreen({ navigation }: { navigation: any }) {
  const colors = useColors()
  const { mode, setMode } = useTheme()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const [serviceTypes, setServiceTypes] = useState<any[]>([])
  const [selectedTypes, setSelectedTypes] = useState<number[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [pushRecall, setPushRecall] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([
      bookingApi.getServiceTypes(),
      preferenceApi.get(),
    ]).then(([typesRes, prefRes]: any[]) => {
      setServiceTypes(typesRes.data || [])
      const pref = prefRes.data || {}
      setSelectedTypes(pref.preferredServiceTypeIds || [])
      setSelectedCities(pref.preferredCities || [])
      setBudgetMin(pref.budgetMin != null ? String(pref.budgetMin) : '')
      setBudgetMax(pref.budgetMax != null ? String(pref.budgetMax) : '')
      setPushRecall(pref.pushRecallEnabled !== false)
    }).catch(() => {})
  }, [])

  const toggleType = (id: number) => {
    setSelectedTypes((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const toggleCity = (city: string) => {
    setSelectedCities((prev) => prev.includes(city) ? prev.filter((x) => x !== city) : [...prev, city])
  }

  const save = async () => {
    setSaving(true)
    try {
      await preferenceApi.save({
        preferredServiceTypeIds: selectedTypes,
        preferredCities: selectedCities,
        budgetMin: budgetMin ? Number(budgetMin) : undefined,
        budgetMax: budgetMax ? Number(budgetMax) : undefined,
        pushRecallEnabled: pushRecall,
      })
      Alert.alert('已儲存', '個人偏好已更新')
      navigation.goBack()
    } catch {
      Alert.alert('儲存失敗', '請稍後再試')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScreenHeader title="拍攝偏好" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>感興趣的拍攝類型</Text>
        <View style={styles.chipRow}>
          {serviceTypes.map((t) => (
            <TouchableOpacity
              key={t.id}
              style={[styles.chip, selectedTypes.includes(t.id) && styles.chipActive]}
              onPress={() => toggleType(t.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedTypes.includes(t.id) }}
              accessibilityLabel={t.name}
            >
              <Text style={[styles.chipText, selectedTypes.includes(t.id) && styles.chipTextActive]}>{t.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>偏好地區</Text>
        <View style={styles.chipRow}>
          {CITIES.map((city) => (
            <TouchableOpacity
              key={city}
              style={[styles.chip, selectedCities.includes(city) && styles.chipActive]}
              onPress={() => toggleCity(city)}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedCities.includes(city) }}
              accessibilityLabel={city}
            >
              <Text style={[styles.chipText, selectedCities.includes(city) && styles.chipTextActive]}>{city}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>預算區間（NT$）</Text>
        <View style={styles.budgetRow}>
          <TextInput style={styles.input} placeholder="最低" placeholderTextColor={colors.textSecondary} keyboardType="numeric" value={budgetMin} onChangeText={setBudgetMin} />
          <Text style={styles.dash}>—</Text>
          <TextInput style={styles.input} placeholder="最高" placeholderTextColor={colors.textSecondary} keyboardType="numeric" value={budgetMax} onChangeText={setBudgetMax} />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>接收回憶召回推播</Text>
          <Switch value={pushRecall} onValueChange={setPushRecall} trackColor={{ true: colors.primary }} />
        </View>

        <Text style={styles.sectionTitle}>外觀主題</Text>
        <View style={styles.chipRow}>
          {THEME_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, mode === opt.value && styles.chipActive]}
              onPress={() => setMode(opt.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: mode === opt.value }}
              accessibilityLabel={opt.label}
            >
              <Text style={[styles.chipText, mode === opt.value && styles.chipTextActive]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Button label={saving ? '儲存中…' : '儲存偏好'} onPress={save} loading={saving} disabled={saving} />
      </ScrollView>
    </SafeAreaView>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.textPrimary, marginBottom: 12, marginTop: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { fontSize: 13, color: colors.textRegular },
  chipTextActive: { color: colors.primary, fontWeight: '700' },
  budgetRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 20 },
  input: { flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: colors.border },
  dash: { color: colors.textSecondary },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 12, padding: 16, marginBottom: 24 },
  switchLabel: { fontSize: 15, color: colors.textPrimary, fontWeight: '600' },
})
