import React, { useEffect, useMemo, useState } from 'react'
import {
  View, Text, TouchableOpacity, StyleSheet, TextInput, Modal, ScrollView, ActivityIndicator,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useColors, AppColors } from '@/theme'
import { POPULAR_LOCATIONS, TAIWAN_CITIES } from '@/constants/locations'
import { googleApi } from '@/api'
import { parseAutocompleteResults, parseTextSearchResults, type PlacePrediction } from '@/utils/googlePlaces'
import { useLocale } from '@/i18n'

interface Props {
  label: string
  city: string
  location: string
  onCityChange: (city: string) => void
  onLocationChange: (location: string) => void
  onCoordsChange?: (coords: { lat: number; lng: number } | null) => void
}

function matchCityFromAddress(address: string): string | null {
  return TAIWAN_CITIES.find(c =>
    address.includes(c) || address.startsWith(c.slice(0, 2))
  ) || null
}

export default function LocationPicker({
  label, city, location, onCityChange, onLocationChange, onCoordsChange,
}: Props) {
  const { t, locale } = useLocale()
  const colors = useColors()
  const styles = React.useMemo(() => makeStyles(colors), [colors])
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [placeResults, setPlaceResults] = useState<PlacePrediction[]>([])
  const [searchingPlaces, setSearchingPlaces] = useState(false)

  const lang = locale === 'en' ? 'en' : 'zh-TW'

  const filteredCities = useMemo(() => {
    if (!query.trim()) return [...TAIWAN_CITIES]
    return TAIWAN_CITIES.filter(c => c.includes(query.trim()))
  }, [query])

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setPlaceResults([])
      return
    }
    let cancelled = false
    const timer = setTimeout(async () => {
      setSearchingPlaces(true)
      try {
        const res: any = await googleApi.autocompletePlaces(query.trim(), lang)
        if (cancelled) return
        const parsed = parseAutocompleteResults(res.data)
        if (parsed.length) {
          setPlaceResults(parsed)
        } else {
          const res2: any = await googleApi.searchPlaces(query.trim(), lang)
          if (cancelled) return
          setPlaceResults(parseTextSearchResults(res2.data))
        }
      } catch {
        if (!cancelled) setPlaceResults([])
      } finally {
        if (!cancelled) setSearchingPlaces(false)
      }
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, open, lang])

  const applyCoords = async (place: PlacePrediction, address: string) => {
    if (place.geometry?.location) {
      const { lat, lng } = place.geometry.location
      if (lat !== 0 || lng !== 0) {
        onCoordsChange?.({ lat, lng })
        return
      }
    }
    try {
      const geo: any = await googleApi.geocode(address)
      const coords = geo.data as number[] | undefined
      if (coords && coords.length >= 2 && (coords[0] !== 0 || coords[1] !== 0)) {
        onCoordsChange?.({ lat: coords[0], lng: coords[1] })
      } else {
        onCoordsChange?.(null)
      }
    } catch {
      onCoordsChange?.(null)
    }
  }

  const selectPlace = async (place: PlacePrediction) => {
    const address = place.description || place.formatted_address || place.name
    onLocationChange(address)
    const matched = matchCityFromAddress(address)
    if (matched) onCityChange(matched)
    else if (!city) onCityChange('台北市')
    await applyCoords(place, address)
    setOpen(false)
  }

  const selectCity = (c: string) => {
    onCityChange(c)
    if (!location) onLocationChange(c)
    onCoordsChange?.(null)
  }

  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.field} onPress={() => setOpen(true)}>
        <Ionicons name="location-outline" size={20} color={colors.primary} />
        <Text style={[styles.fieldText, !location && styles.placeholder]} numberOfLines={2}>
          {location || t('location.placeholder')}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
      {city ? (
        <Text style={styles.cityHint}>{t('location.cityHint', { city })}</Text>
      ) : null}

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{t('location.modalTitle')}</Text>
            <View style={{ width: 24 }} />
          </View>

          <TextInput
            style={styles.search}
            value={query}
            onChangeText={setQuery}
            placeholder={t('location.searchPlaceholder')}
            placeholderTextColor={colors.textSecondary}
          />

          <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
            {query.trim().length >= 2 && (
              <>
                <Text style={styles.section}>{t('location.googleResults')}</Text>
                {searchingPlaces ? (
                  <View style={styles.searchingRow}>
                    <ActivityIndicator size="small" color={colors.primary} />
                    <Text style={styles.searchingText}>{t('location.searching')}</Text>
                  </View>
                ) : placeResults.length > 0 ? (
                  placeResults.map(place => (
                    <TouchableOpacity
                      key={place.place_id}
                      style={styles.placeRow}
                      onPress={() => selectPlace(place)}
                    >
                      <Ionicons name="navigate-outline" size={18} color={colors.primary} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.placeName}>{place.name}</Text>
                        {place.formatted_address ? (
                          <Text style={styles.placeAddr} numberOfLines={1}>{place.formatted_address}</Text>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  ))
                ) : null}
              </>
            )}

            <Text style={styles.section}>{t('location.popular')}</Text>
            <View style={styles.chips}>
              {POPULAR_LOCATIONS.map(loc => (
                <TouchableOpacity
                  key={loc}
                  style={[styles.chip, location === loc && styles.chipActive]}
                  onPress={async () => {
                    onLocationChange(loc)
                    const matched = matchCityFromAddress(loc)
                    if (matched) onCityChange(matched)
                    else if (!city) onCityChange('台北市')
                    await applyCoords({ place_id: loc, name: loc }, loc)
                    setOpen(false)
                  }}
                >
                  <Text style={[styles.chipText, location === loc && styles.chipTextActive]}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.section}>{t('location.cities')}</Text>
            {filteredCities.map((item) => (
              <TouchableOpacity
                key={item}
                style={[styles.cityRow, city === item && styles.cityRowActive]}
                onPress={() => {
                  selectCity(item)
                  if (!location || TAIWAN_CITIES.some(c => location === c)) onLocationChange(item)
                  setOpen(false)
                }}
              >
                <Text style={[styles.cityText, city === item && styles.cityTextActive]}>{item}</Text>
                {city === item ? <Ionicons name="checkmark" size={18} color={colors.primary} /> : null}
              </TouchableOpacity>
            ))}

            <Text style={styles.section}>{t('location.custom')}</Text>
            <View style={styles.customRow}>
              <TextInput
                style={styles.customInput}
                value={location}
                onChangeText={onLocationChange}
                placeholder={t('location.customPlaceholder')}
              />
              <TouchableOpacity
                style={styles.customBtn}
                onPress={() => {
                  if (location && !city) {
                    const matched = matchCityFromAddress(location)
                    if (matched) onCityChange(matched)
                  }
                  onCoordsChange?.(null)
                  setOpen(false)
                }}
              >
                <Text style={styles.customBtnText}>{t('common.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
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
  cityHint: { fontSize: 12, color: colors.textSecondary, marginTop: 6, marginLeft: 4 },
  modal: { flex: 1, backgroundColor: colors.background, paddingTop: 48 },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: colors.textPrimary },
  search: {
    marginHorizontal: 16, marginBottom: 12, backgroundColor: colors.surface,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  section: {
    fontSize: 14, fontWeight: '600', color: colors.textSecondary,
    marginHorizontal: 16, marginTop: 12, marginBottom: 8,
  },
  searchingRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 8 },
  searchingText: { fontSize: 14, color: colors.textSecondary },
  placeRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  placeName: { fontSize: 15, fontWeight: '600', color: colors.textPrimary },
  placeAddr: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  chip: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border,
  },
  chipActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  chipText: { fontSize: 13, color: colors.textRegular },
  chipTextActive: { color: colors.primary, fontWeight: '600' },
  cityRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14, backgroundColor: colors.surface,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  cityRowActive: { backgroundColor: colors.primaryLight },
  cityText: { fontSize: 16, color: colors.textPrimary },
  cityTextActive: { color: colors.primary, fontWeight: '600' },
  customRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginTop: 4 },
  customInput: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 16,
    borderWidth: 1, borderColor: colors.border,
  },
  customBtn: {
    backgroundColor: colors.primary, borderRadius: 12,
    paddingHorizontal: 16, justifyContent: 'center',
  },
  customBtnText: { color: colors.white, fontWeight: '600' },
})
