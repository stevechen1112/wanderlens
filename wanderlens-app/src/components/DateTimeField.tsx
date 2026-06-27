import React, { useState, createElement } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, Platform, Modal,
} from 'react-native'
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'
import dayjs from 'dayjs'
import { useColors, AppColors } from '@/theme'
import { useLocale } from '@/i18n'

interface Props {
  label: string
  mode: 'date' | 'time'
  value: string
  onChange: (value: string) => void
  minimumDate?: Date
}

function parseValue(mode: 'date' | 'time', value: string): Date {
  if (mode === 'date' && value) {
    const d = dayjs(value, 'YYYY-MM-DD', true)
    if (d.isValid()) return d.toDate()
  }
  if (mode === 'time' && value) {
    const [h, m] = value.split(':').map(Number)
    const d = new Date()
    d.setHours(h || 0, m || 0, 0, 0)
    return d
  }
  return new Date()
}

export default function DateTimeField({ label, mode, value, onChange, minimumDate }: Props) {
  const { t } = useLocale()
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const [show, setShow] = useState(false)
  const [draft, setDraft] = useState(parseValue(mode, value))

  const display = value || (mode === 'date' ? t('datetime.pickDate') : t('datetime.pickTime'))

  const commit = (date: Date) => {
    if (mode === 'date') {
      onChange(dayjs(date).format('YYYY-MM-DD'))
    } else {
      onChange(dayjs(date).format('HH:mm'))
    }
  }

  const onPickerChange = (_: DateTimePickerEvent, selected?: Date) => {
    if (Platform.OS === 'android') setShow(false)
    if (selected) {
      setDraft(selected)
      if (Platform.OS === 'android') commit(selected)
    }
  }

  if (Platform.OS === 'web') {
    return (
      <View style={styles.group}>
        <Text style={styles.label}>{label}</Text>
        {createElement('input', {
          type: mode === 'date' ? 'date' : 'time',
          value: value || '',
          min: mode === 'date' && minimumDate ? dayjs(minimumDate).format('YYYY-MM-DD') : undefined,
          onChange: (e: { target: { value: string } }) => onChange(e.target.value),
          style: {
            width: '100%',
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 12,
            paddingLeft: 14,
            paddingRight: 14,
            paddingTop: 12,
            paddingBottom: 12,
            fontSize: 16,
            backgroundColor: colors.surface,
            boxSizing: 'border-box',
          },
        })}
      </View>
    )
  }

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.field}
        onPress={() => { setDraft(parseValue(mode, value)); setShow(true) }}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${display}`}
      >
        <Ionicons
          name={mode === 'date' ? 'calendar-outline' : 'time-outline'}
          size={20}
          color={colors.primary}
        />
        <Text style={[styles.fieldText, !value && styles.placeholder]}>{display}</Text>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal visible={show} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalSheet}>
              <View style={styles.modalBar}>
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={styles.modalCancel}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                <Text style={styles.modalTitle}>{label}</Text>
                <TouchableOpacity onPress={() => { commit(draft); setShow(false) }}>
                  <Text style={styles.modalDone}>{t('datetime.done')}</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={draft}
                mode={mode}
                display="spinner"
                minimumDate={minimumDate}
                onChange={(_, d) => d && setDraft(d)}
                locale="zh-TW"
              />
            </View>
          </View>
        </Modal>
      ) : show ? (
        <DateTimePicker
          value={draft}
          mode={mode}
          minimumDate={minimumDate}
          onChange={onPickerChange}
        />
      ) : null}
    </View>
  )
}

const makeStyles = (colors: AppColors) => StyleSheet.create({
  group: { marginBottom: 16 },
  label: { fontSize: 14, color: colors.textSecondary, marginBottom: 6 },
  field: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    borderWidth: 1, borderColor: colors.border, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, backgroundColor: colors.surface,
  },
  fieldText: { flex: 1, fontSize: 16, color: colors.textPrimary },
  placeholder: { color: colors.textSecondary },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: colors.overlay },
  modalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  modalBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  modalTitle: { fontSize: 16, fontWeight: '600', color: colors.textPrimary },
  modalCancel: { fontSize: 16, color: colors.textSecondary },
  modalDone: { fontSize: 16, fontWeight: '600', color: colors.primary },
})
