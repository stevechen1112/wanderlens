export interface PlacePrediction {
  place_id: string
  name: string
  formatted_address?: string
  description?: string
  geometry?: { location: { lat: number; lng: number } }
}

export function parseGooglePayload(raw: unknown): Record<string, unknown> {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw) as Record<string, unknown>
    } catch {
      return {}
    }
  }
  if (raw && typeof raw === 'object') return raw as Record<string, unknown>
  return {}
}

/** Text Search API（/google/places/search） */
export function parseTextSearchResults(raw: unknown): PlacePrediction[] {
  const payload = parseGooglePayload(raw)
  const results = (payload.results as PlacePrediction[] | undefined) || []
  return results.slice(0, 8).map((r) => ({
    place_id: r.place_id,
    name: r.name,
    formatted_address: r.formatted_address,
    geometry: r.geometry,
  }))
}

/** Autocomplete API（/google/places/autocomplete） */
export function parseAutocompleteResults(raw: unknown): PlacePrediction[] {
  const payload = parseGooglePayload(raw)
  const predictions = (payload.predictions as Array<{
    place_id: string
    description: string
    structured_formatting?: { main_text?: string; secondary_text?: string }
  }> | undefined) || []
  return predictions.slice(0, 8).map((p) => ({
    place_id: p.place_id,
    name: p.structured_formatting?.main_text || p.description,
    formatted_address: p.structured_formatting?.secondary_text || p.description,
    description: p.description,
  }))
}
